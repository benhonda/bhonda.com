terraform {
  source = "../../modules/shared"
}

include "root" {
  path = find_in_parent_folders()
}

inputs = {
  env         = "shared"
  name_prefix = "bhonda-com-shared"

  # Route53 configuration
  domains = {
    "bhonda-com"   = "bhonda.com"
    "bhonda-ca"    = "bhonda.ca"
    "benhonda-dev" = "benhonda.dev"
  }

  # Staging DNS records
  staging_dns_records = {
    "app-staging-com" = {
      domain    = "bhonda-com"
      subdomain = "app-staging"
      type      = "CNAME"
      ttl       = 300
      records   = ["4a329c9f48a47eb1.vercel-dns-016.com"]
    }
  }

  # Production DNS records
  production_dns_records = {
    # bhonda.com
    "root-com" = {
      domain    = "bhonda-com"
      subdomain = ""
      type      = "A"
      ttl       = 300
      records   = ["216.150.1.1"]
    }
    "www-com" = {
      domain    = "bhonda-com"
      subdomain = "www"
      type      = "CNAME"
      ttl       = 300
      records   = ["4a329c9f48a47eb1.vercel-dns-016.com"]
    }
    "app-com" = {
      domain    = "bhonda-com"
      subdomain = "app"
      type      = "CNAME"
      ttl       = 300
      records   = ["4a329c9f48a47eb1.vercel-dns-016.com"]
    }
    # bhonda.ca
    "root-ca" = {
      domain    = "bhonda-ca"
      subdomain = ""
      type      = "A"
      ttl       = 300
      records   = ["216.150.1.1"]
    }
    "www-ca" = {
      domain    = "bhonda-ca"
      subdomain = "www"
      type      = "CNAME"
      ttl       = 300
      records   = ["4a329c9f48a47eb1.vercel-dns-016.com"]
    }
    # benhonda.dev
    "root-dev" = {
      domain    = "benhonda-dev"
      subdomain = ""
      type      = "A"
      ttl       = 300
      records   = ["216.150.1.1"]
    }
    "www-dev" = {
      domain    = "benhonda-dev"
      subdomain = "www"
      type      = "CNAME"
      ttl       = 300
      records   = ["4a329c9f48a47eb1.vercel-dns-016.com"]
    }
  }

  # S3 assets bucket
  enable_assets_bucket = true
}
