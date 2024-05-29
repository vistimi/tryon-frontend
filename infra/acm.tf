# data "aws_acm_certificate" "amazon_issued" {
#   domain      = local.domain_name
#   types       = ["AMAZON_ISSUED"]
#   most_recent = true
# }