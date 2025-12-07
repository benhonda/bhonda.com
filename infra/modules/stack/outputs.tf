output "vercel_role_arn" {
  description = "ARN of Vercel IAM role"
  value       = var.enable_vercel_integration ? aws_iam_role.vercel[0].arn : null
}

output "bunnynet_pull_zone_url" {
  description = "BunnyNet CDN pull zone URL"
  value       = var.enable_bunnynet_cdn ? "https://${bunnynet_pullzone.cdn[0].name}.b-cdn.net" : null
}
