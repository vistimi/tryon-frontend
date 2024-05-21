# Provider used for creating the Lambda@Edge function which must be deployed
# to us-east-1 region (Should not be changed)
provider "aws" {
  alias  = "global_region"
  region = var.global_region
}

module "next_serverless" {
  source  = "Nexode-Consulting/nextjs-serverless/aws"
  version = "0.2.20" # same as package.json

  deployment_name = var.name
  region          = data.aws_region.current.name

  cloudfront_acm_certificate_arn = data.aws_acm_certificate.amazon_issued.arn
  cloudfront_aliases             = [local.domain_name]

  base_dir                                  = var.base_dir
  image_optimization_lambda_memory_size     = 2048 #[128; 10240]
  image_optimization_ephemeral_storage_size = 512  #[512; 10240]
  image_optimization_logs_retention         = var.retention_in_days
  image_optimization_runtime                = "nodejs18.x"
  next_lambda_memory_size                   = 1024 #[128; 10240]
  next_lambda_ephemeral_storage_size        = 512 #[512; 10240]
  next_lambda_logs_retention                = var.retention_in_days
  next_lambda_runtime                       = "nodejs18.x"

  # name_prefix = "/aws/apigateway"

  next_lambda_env_vars = {
    NODE_ENV                           = "production"
    NEXT_PUBLIC_API_URL                = var.env.NEXT_PUBLIC_API_URL
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = var.env.stripe_publishable_key
    STRIPE_SECRET_KEY                  = var.env.stripe_secret_key
  }
}