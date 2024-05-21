locals {
  domain_name = join(".", compact([var.domain.prefix, var.domain.zone]))
}

data "aws_route53_zone" "this" {
  name         = var.domain.zone
  private_zone = false
}