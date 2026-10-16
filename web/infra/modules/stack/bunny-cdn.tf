########################################################################################################################
# BUNNYNET PROVIDER SETUP
########################################################################################################################
data "aws_secretsmanager_secret" "bunnynet_secret" {
  count = var.enable_bunnynet_cdn ? 1 : 0
  name  = "shared/bunnynet"
}

data "aws_secretsmanager_secret_version" "bunnynet_secret_version" {
  count     = var.enable_bunnynet_cdn ? 1 : 0
  secret_id = data.aws_secretsmanager_secret.bunnynet_secret[0].id
}

locals {
  bunnynet_api_key   = var.enable_bunnynet_cdn ? jsondecode(data.aws_secretsmanager_secret_version.bunnynet_secret_version[0].secret_string)["bunny_api_key"] : ""
  bunny_user_name    = "${var.name_prefix}-bunnynet-user"
  bunny_policy_name  = "${var.name_prefix}-bunnynet-policy"
  shared_bucket_arn  = "arn:aws:s3:::${var.shared_assets_bucket}"
}

provider "bunnynet" {
  api_key = local.bunnynet_api_key
}

########################################################################################################################
# IAM RESOURCES FOR BUNNYNET S3 ACCESS
########################################################################################################################

# Create an IAM user that BunnyNet can use to access the S3 bucket
resource "aws_iam_user" "bunnynet" {
  count = var.enable_bunnynet_cdn ? 1 : 0
  name  = local.bunny_user_name
  tags  = local.common_tags
}

# Create an IAM policy that allows the IAM user to read from specific paths in the bucket
resource "aws_iam_policy" "bunnynet" {
  count       = var.enable_bunnynet_cdn ? 1 : 0
  name        = local.bunny_policy_name
  description = "Allow BunnyNet CDN to access ${var.shared_assets_bucket} bucket at ${var.bunnynet_s3_path_prefix} prefix"
  tags        = local.common_tags

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "ListBucket"
        Effect = "Allow"
        Action = ["s3:ListBucket"]
        Resource = [
          local.shared_bucket_arn
        ]
        Condition = {
          StringLike = {
            "s3:prefix" = ["${var.bunnynet_s3_path_prefix}/public/*"]
          }
        }
      },
      {
        Sid    = "GetObjects"
        Effect = "Allow"
        Action = ["s3:GetObject"]
        Resource = [
          "${local.shared_bucket_arn}/${var.bunnynet_s3_path_prefix}/public/*"
        ]
      }
    ]
  })
}

# Attach the policy to the IAM user
resource "aws_iam_user_policy_attachment" "bunnynet" {
  count      = var.enable_bunnynet_cdn ? 1 : 0
  user       = aws_iam_user.bunnynet[0].name
  policy_arn = aws_iam_policy.bunnynet[0].arn
}

# Create an access key for the IAM user
resource "aws_iam_access_key" "bunnynet" {
  count = var.enable_bunnynet_cdn ? 1 : 0
  user  = aws_iam_user.bunnynet[0].name
}

########################################################################################################################
# BUNNYNET CDN PULL ZONE
########################################################################################################################

resource "bunnynet_pullzone" "cdn" {
  count = var.enable_bunnynet_cdn ? 1 : 0
  name  = var.bunnynet_pull_zone_name

  origin {
    type = "OriginUrl"
    url  = "https://${var.shared_assets_bucket}.s3.${var.aws_region}.amazonaws.com/${var.bunnynet_s3_path_prefix}/public"
  }

  routing {
    tier  = "Standard"
    zones = ["US"]
  }

  # Cache settings
  cache_enabled         = true
  cache_expiration_time = 86400  # 24 hours

  # S3 authentication
  s3_auth_enabled = true
  s3_auth_key     = aws_iam_access_key.bunnynet[0].id
  s3_auth_secret  = aws_iam_access_key.bunnynet[0].secret
  s3_auth_region  = var.aws_region

  # Additional settings
  originshield_enabled = false
  optimizer_enabled    = false

  depends_on = [
    aws_iam_user_policy_attachment.bunnynet,
    aws_iam_access_key.bunnynet
  ]
}
