########################################################################################################################
# S3 ASSETS BUCKET
########################################################################################################################

resource "aws_s3_bucket" "assets" {
  count  = var.enable_assets_bucket ? 1 : 0
  bucket = "${var.repo_name}-assets"
  tags   = local.common_tags
}

resource "aws_s3_bucket_versioning" "assets" {
  count  = var.enable_assets_bucket ? 1 : 0
  bucket = aws_s3_bucket.assets[0].id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "assets" {
  count  = var.enable_assets_bucket ? 1 : 0
  bucket = aws_s3_bucket.assets[0].id

  rule {
    id     = "cleanup-staging-files"
    status = "Enabled"

    filter {
      prefix = "staging/"
    }

    expiration {
      days = 30
    }

    noncurrent_version_expiration {
      noncurrent_days = 7
    }
  }
}

resource "aws_s3_bucket_public_access_block" "assets" {
  count  = var.enable_assets_bucket ? 1 : 0
  bucket = aws_s3_bucket.assets[0].id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
