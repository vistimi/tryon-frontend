locals {
  domain_name = join(".", compact([var.domain.prefix, var.domain.zone]))
}

data "aws_route53_zone" "this" {
  name         = var.domain.zone
  private_zone = false
}

resource "aws_route53_record" "next_cloudfront_alias" {
  zone_id = data.aws_route53_zone.this.zone_id
  name    = local.domain_name
  type    = "A"

  allow_overwrite = true

  alias {
    name                   = module.next_serverless.cloudfront_url
    zone_id                = module.next_serverless.distribution.next_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}