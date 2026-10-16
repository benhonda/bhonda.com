########################################################################################################################
# VERCEL OIDC INTEGRATION
########################################################################################################################

# Use existing OIDC provider (team-shared)
data "aws_iam_openid_connect_provider" "vercel" {
  count = var.enable_vercel_integration ? 1 : 0
  url   = "https://oidc.vercel.com/${var.vercel_team_slug}"
}

# IAM role with standard trust policy
resource "aws_iam_role" "vercel" {
  count = var.enable_vercel_integration ? 1 : 0
  name  = "${var.name_prefix}-vercel-integration"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Federated = data.aws_iam_openid_connect_provider.vercel[0].arn }
      Action    = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "oidc.vercel.com/${var.vercel_team_slug}:aud" = "https://vercel.com/${var.vercel_team_slug}"
        }
        StringLike = {
          "oidc.vercel.com/${var.vercel_team_slug}:sub" = [
            for env in var.vercel_allowed_environments :
            "owner:${var.vercel_team_slug}:project:${var.vercel_project_name}:environment:${env}"
          ]
        }
      }
    }]
  })
  tags = local.common_tags
}

# Vercel permissions - S3 read/write to shared bucket with environment path prefix
resource "aws_iam_role_policy" "vercel" {
  count = var.enable_vercel_integration ? 1 : 0
  name  = "vercel-permissions"
  role  = aws_iam_role.vercel[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:GetObjectVersion",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket",
          "s3:ListBucketVersions",
          "s3:ListObjectVersions"
        ]
        Resource = [
          "arn:aws:s3:::${var.shared_assets_bucket}",
          "arn:aws:s3:::${var.shared_assets_bucket}/${var.env}/*"
        ]
      }
    ]
  })
}
