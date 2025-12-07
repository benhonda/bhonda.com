locals {
  aws_profile = "pharmer"
  repo_name   = "bhonda-com"
  aws_region  = "ca-central-1"
}

remote_state {
  backend = "s3"
  generate = {
    path      = "backend.tf"
    if_exists = "overwrite"
  }
  config = {
    bucket  = "terraform-state-sensitive"
    key     = "${local.repo_name}/${path_relative_to_include()}/terraform.tfstate"
    region  = local.aws_region
    profile = local.aws_profile
    encrypt = true
  }
}

inputs = {
  aws_profile = local.aws_profile
  repo_name   = local.repo_name
  aws_region  = local.aws_region
}

generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite"
  contents  = <<EOF
provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile

  default_tags {
    tags = {
      Environment = var.env
      Project     = var.repo_name
      ManagedBy   = "terraform"
    }
  }
}
EOF
}
