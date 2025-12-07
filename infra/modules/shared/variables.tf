# Core variables
variable "env" {
  description = "Environment name"
  type        = string
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

# Route53 variables
variable "domains" {
  description = "Map of domain keys to domain names"
  type        = map(string)
  default     = {}
}

variable "staging_dns_records" {
  description = "DNS records for staging environment"
  type = map(object({
    domain    = string
    subdomain = string
    type      = string
    ttl       = number
    records   = list(string)
  }))
  default = {}
}

variable "production_dns_records" {
  description = "DNS records for production environment"
  type = map(object({
    domain    = string
    subdomain = string
    type      = string
    ttl       = number
    records   = list(string)
  }))
  default = {}
}

# S3 variables
variable "enable_assets_bucket" {
  description = "Whether to create shared S3 assets bucket"
  type        = bool
  default     = false
}
