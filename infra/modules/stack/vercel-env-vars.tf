########################################################################################################################
# VERCEL PROVIDER SETUP
########################################################################################################################
data "aws_secretsmanager_secret" "vercel_secret" {
  count = var.enable_vercel_integration ? 1 : 0
  name  = "shared/vercel"
}

data "aws_secretsmanager_secret_version" "vercel_secret_version" {
  count     = var.enable_vercel_integration ? 1 : 0
  secret_id = data.aws_secretsmanager_secret.vercel_secret[0].id
}

locals {
  vercel_api_token = var.enable_vercel_integration ? jsondecode(data.aws_secretsmanager_secret_version.vercel_secret_version[0].secret_string)["tf_token_adpharm_exp_apr_2026"] : ""
}

provider "vercel" {
  api_token = local.vercel_api_token
  team      = var.vercel_team_slug
}

########################################################################################################################
# ENVIRONMENT VARIABLES DEFINITION
########################################################################################################################
locals {
  # TF-managed vars (auto-update from Terraform)
  tf_managed_vars_base = merge(
    var.enable_vercel_integration ? {
      AWS_REGION = {
        value      = var.aws_region
        comment    = "AWS region - Managed by Terraform"
        tf_managed = true
      }
      AWS_ROLE_ARN = {
        value      = aws_iam_role.vercel[0].arn
        comment    = "IAM role ARN for OIDC - Managed by Terraform"
        tf_managed = true
      }
      S3_BUCKET_NAME = {
        value      = var.shared_assets_bucket
        comment    = "Shared S3 assets bucket - Managed by Terraform"
        tf_managed = true
      }
      S3_BUCKET_KEY_PREFIX_NO_SLASHES = {
        value      = var.env
        comment    = "S3 bucket key prefix (environment name) - Managed by Terraform"
        tf_managed = true
      }
      APP_FQDN = {
        value      = var.app_fqdn
        comment    = "App fully qualified domain name - Managed by Terraform"
        tf_managed = true
      }
      PUBLIC_CDN_URL = {
        value      = var.enable_bunnynet_cdn ? "https://${bunnynet_pullzone.cdn[0].name}.b-cdn.net" : ""
        comment    = "CDN URL - Managed by Terraform"
        tf_managed = true
      }
    } : {}
  )

  # Manual secrets (placeholders with lifecycle ignore)
  manual_vars_base = {
    GOOGLE_OAUTH2_CLIENT_ID = {
      value      = "MANUALLY_SET_IN_VERCEL"
      comment    = "Google OAuth2 client ID - Set manually in Vercel"
      tf_managed = false
    }
    GOOGLE_OAUTH2_CLIENT_SECRET = {
      value      = "MANUALLY_SET_IN_VERCEL"
      comment    = "Google OAuth2 client secret - Set manually in Vercel"
      tf_managed = false
    }
    DATABASE_URL = {
      value      = "MANUALLY_SET_IN_VERCEL"
      comment    = "PostgreSQL database URL - Set manually in Vercel"
      tf_managed = false
    }
    SESSION_SECRET = {
      value      = "MANUALLY_SET_IN_VERCEL"
      comment    = "Session secret - Set manually in Vercel"
      tf_managed = false
    }
    CLAUDE_CODE_OAUTH_TOKEN = {
      value      = "MANUALLY_SET_IN_VERCEL"
      comment    = "Claude Code OAuth token - Set manually in Vercel"
      tf_managed = false
    }
    GITHUB_PAT = {
      value      = "MANUALLY_SET_IN_VERCEL"
      comment    = "GitHub Personal Access Token - Set manually in Vercel"
      tf_managed = false
    }
    CRON_SECRET = {
      value      = "MANUALLY_SET_IN_VERCEL"
      comment    = "Cron secret for webhook authentication - Set manually in Vercel"
      tf_managed = false
    }
  }

  common_env_vars_base = merge(local.tf_managed_vars_base, local.manual_vars_base)
  tf_managed_vars      = { for k, v in local.common_env_vars_base : k => v if v.tf_managed }
  manual_vars          = { for k, v in local.common_env_vars_base : k => v if !v.tf_managed }
}

########################################################################################################################
# STAGING CUSTOM ENVIRONMENT
########################################################################################################################
resource "vercel_custom_environment" "staging" {
  count      = var.env == "staging" && var.enable_vercel_integration ? 1 : 0
  project_id = var.vercel_project_id
  name       = "staging"
  branch_tracking = {
    pattern = "staging"
    type    = "equals"
  }
}

########################################################################################################################
# STAGING ENVIRONMENT VARIABLES
########################################################################################################################
resource "vercel_project_environment_variable" "staging_tf_managed" {
  for_each   = var.env == "staging" && var.enable_vercel_integration ? local.tf_managed_vars : {}
  project_id = var.vercel_project_id
  key        = each.key
  value      = each.value.value
  target     = ["development"]
  custom_environment_ids = [vercel_custom_environment.staging[0].id]
  comment    = lookup(each.value, "comment", null)
  sensitive  = false
}

resource "vercel_project_environment_variable" "staging_manual" {
  for_each   = var.env == "staging" && var.enable_vercel_integration ? local.manual_vars : {}
  project_id = var.vercel_project_id
  key        = each.key
  value      = each.value.value
  target     = ["development"]
  custom_environment_ids = [vercel_custom_environment.staging[0].id]
  comment    = lookup(each.value, "comment", null)
  sensitive  = false
  lifecycle {
    ignore_changes = [value]
  }
}

########################################################################################################################
# PRODUCTION ENVIRONMENT VARIABLES
########################################################################################################################
resource "vercel_project_environment_variable" "production_tf_managed" {
  for_each   = var.env == "production" && var.enable_vercel_integration ? local.tf_managed_vars : {}
  project_id = var.vercel_project_id
  key        = each.key
  value      = each.value.value
  target     = ["production"]
  comment    = lookup(each.value, "comment", null)
  sensitive  = false
}

resource "vercel_project_environment_variable" "production_manual" {
  for_each   = var.env == "production" && var.enable_vercel_integration ? local.manual_vars : {}
  project_id = var.vercel_project_id
  key        = each.key
  value      = each.value.value
  target     = ["production"]
  comment    = lookup(each.value, "comment", null)
  sensitive  = false
  lifecycle {
    ignore_changes = [value]
  }
}
