# Core variables
variable "env" {
  description = "Environment name"
  type        = string
  validation {
    condition     = contains(["staging", "production"], var.env)
    error_message = "Must be staging or production"
  }
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "aws_profile" {
  description = "AWS profile to use"
  type        = string
}

variable "repo_name" {
  description = "Repository name"
  type        = string
}

variable "name_prefix" {
  description = "Prefix for all resource names"
  type        = string
}

# Shared resources
variable "shared_assets_bucket" {
  description = "Name of shared S3 assets bucket"
  type        = string
}

# Vercel variables
variable "enable_vercel_integration" {
  description = "Whether to enable Vercel OIDC integration"
  type        = bool
  default     = false
}

variable "vercel_team_slug" {
  description = "Vercel team slug"
  type        = string
  default     = ""
}

variable "vercel_project_name" {
  description = "Vercel project name"
  type        = string
  default     = ""
}

variable "vercel_project_id" {
  description = "Vercel project ID"
  type        = string
  default     = ""
}

variable "vercel_allowed_environments" {
  description = "List of Vercel environments allowed to assume the IAM role"
  type        = list(string)
  default     = []
}

variable "enable_vercel_preview_env" {
  description = "Whether to create environment variables for Vercel preview deployments"
  type        = bool
  default     = false
}

variable "app_fqdn" {
  description = "App fully qualified domain name"
  type        = string
  default     = ""
}

# BunnyNet variables
variable "enable_bunnynet_cdn" {
  description = "Whether to enable BunnyNet CDN"
  type        = bool
  default     = false
}

variable "bunnynet_pull_zone_name" {
  description = "BunnyNet pull zone name"
  type        = string
  default     = ""
}

variable "bunnynet_s3_path_prefix" {
  description = "S3 path prefix for BunnyNet to access"
  type        = string
  default     = ""
}
