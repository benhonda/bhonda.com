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
  bunnynet_api_key = var.enable_bunnynet_cdn ? jsondecode(data.aws_secretsmanager_secret_version.bunnynet_secret_version[0].secret_string)["bunny_api_key"] : ""
}

provider "bunnynet" {
  api_key = local.bunnynet_api_key
}

########################################################################################################################
# BUNNYNET CDN PULL ZONE
########################################################################################################################

resource "bunnynet_pullzone" "cdn" {
  count = var.enable_bunnynet_cdn ? 1 : 0
  name  = var.bunnynet_pull_zone_name

  origin {
    type = "OriginUrl"
    url  = "https://${var.shared_assets_bucket}.s3.${var.aws_region}.amazonaws.com/${var.bunnynet_s3_path_prefix}"
  }

  routing {
    tier  = "Standard"
    zones = ["US"]  # North America
  }
}
