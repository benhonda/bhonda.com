terraform {
  required_version = ">= 1.13.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.14.1"
    }
  }
}

data "aws_caller_identity" "current" {}

locals {
  account_id = data.aws_caller_identity.current.account_id

  # Common tags
  common_tags = {
    ManagedBy   = "terraform"
    Environment = "shared"
    Project     = var.repo_name
  }
}
