########################################################################################################################
# ROUTE53
########################################################################################################################

# Import existing hosted zones
data "aws_route53_zone" "domains" {
  for_each = var.domains

  name         = each.value
  private_zone = false
}

# Staging subdomains
resource "aws_route53_record" "staging_records" {
  for_each = var.staging_dns_records

  zone_id = data.aws_route53_zone.domains[each.value.domain].zone_id
  name    = each.value.subdomain != "" ? "${each.value.subdomain}.${var.domains[each.value.domain]}" : var.domains[each.value.domain]
  type    = each.value.type
  ttl     = each.value.ttl
  records = each.value.records
}

# Production subdomains
resource "aws_route53_record" "production_records" {
  for_each = var.production_dns_records

  zone_id = data.aws_route53_zone.domains[each.value.domain].zone_id
  name    = each.value.subdomain != "" ? "${each.value.subdomain}.${var.domains[each.value.domain]}" : var.domains[each.value.domain]
  type    = each.value.type
  ttl     = each.value.ttl
  records = each.value.records
}
