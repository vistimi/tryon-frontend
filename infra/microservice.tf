module "microservice" {
  source  = "vistimi/microservice/aws"
  version = "0.0.29"

  name = var.name

  vpc = {
    id              = module.vpc.vpc_id
    subnet_tier_ids = module.vpc.public_subnets
  }

  acm = {
    arn = data.aws_acm_certificate.amazon_issued.arn
  }

  route53 = {
    zones = [{
      name = data.aws_route53_zone.this.name
    }]
    record = {
      prefixes       = ["www"]
      subdomain_name = var.domain.prefix
    }
  }

  # bucket_env = {
  #   force_destroy = !var.longlived
  #   versioning    = var.longlived
  #   file_key      = "${random_id.rng.hex}.env"
  #   file_path     = local_file.env.filename
  # }

  orchestrator = var.microservice.orchestrator

  tags = var.tags
}