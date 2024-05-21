output "next_serverless" {
  value = module.next_serverless
}

output "route53" {
  value = aws_route53_record.next_cloudfront_alias
}