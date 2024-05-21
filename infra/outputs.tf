output "microservice" {
  value = module.microservice
}

output "route53" {
  value = aws_route53_record.next_cloudfront_alias
}