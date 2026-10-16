terraform {
  source = "../../modules/stack"
}

include "root" {
  path = find_in_parent_folders()
}

# Read outputs from shared environment
dependency "shared" {
  config_path = "../shared"

  mock_outputs = {
    assets_bucket_name = "temporary-mock-bucket-name"
    route53_zone_ids   = { "bhonda" = "Z1234567890ABC" }
  }
}

inputs = {
  env         = "production"
  name_prefix = "bhonda-com-production"

  # Shared resource IDs
  shared_assets_bucket = dependency.shared.outputs.assets_bucket_name

  # Vercel configuration
  enable_vercel_integration = true
  vercel_team_slug          = "adpharm"
  vercel_project_name       = "bhonda-com"
  vercel_project_id         = "prj_omcPGOmhxn9VEVIMVLTogtofBjfp"
  vercel_allowed_environments = ["production"]
  enable_vercel_preview_env = false
  app_fqdn                  = "www.bhonda.com"

  # BunnyNet CDN configuration
  enable_bunnynet_cdn = true
  bunnynet_pull_zone_name = "bhonda-production"
  bunnynet_s3_path_prefix = "production"
}
