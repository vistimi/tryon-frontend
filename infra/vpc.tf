data "aws_availability_zones" "available" {
  state = "available"
}

locals {
  # https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/5.1.1?utm_content=documentLink&utm_medium=Visual+Studio+Code&utm_source=terraform-ls#private-versus-intra-subnets
  tier_tags = ["public"] # "private", "intra", "database"

  # increment from `0.0.0.0/16` to `0.0.16.0/16`
  azs = try(slice(data.aws_availability_zones.available.names, 0, var.vpc.az_max), data.aws_availability_zones.available.names)
  subnets = {
    for tier_idx, tier in local.tier_tags :
    "${tier}" => [for az_idx in range(0, length(local.azs)) : cidrsubnet(var.vpc.cidr_ipv4, 4, tier_idx * length(local.azs) + az_idx)]
  }
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.6.0"

  name = var.name
  cidr = var.vpc.cidr_ipv4

  map_public_ip_on_launch = true # eks

  # https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/5.1.1?utm_content=documentLink&utm_medium=Visual+Studio+Code&utm_source=terraform-ls#nat-gateway-scenarios
  enable_nat_gateway     = var.vpc.nat != null ? true : false
  single_nat_gateway     = var.vpc.nat == "vpc" ? true : false
  one_nat_gateway_per_az = var.vpc.nat == "az" ? true : false
  # one nat per subnet is enable_nat_gateway true only

  azs = local.azs

  public_subnets = local.subnets["public"]
  # private_subnets  = local.subnets["private"]
  # intra_subnets    = local.subnets["intra"]
  # database_subnets = local.subnets["database"]

  public_subnet_tags = { Tier = "public" }
  # private_subnet_tags  = { Tier = "private" }
  # intra_subnet_tags    = { Tier = "intra" }
  # database_subnet_tags = { Tier = "database" }

  tags = var.tags
}