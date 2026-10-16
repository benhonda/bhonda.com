output "assets_bucket_name" {
  description = "Name of shared S3 assets bucket"
  value       = var.enable_assets_bucket ? aws_s3_bucket.assets[0].id : null
}

output "route53_zone_ids" {
  description = "Map of domain names to hosted zone IDs"
  value = {
    for k, v in data.aws_route53_zone.domains : k => v.zone_id
  }
}
