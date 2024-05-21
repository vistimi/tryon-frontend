locals {
  environment         = get_env("BRANCH_REF")
  account_region_name = get_env("AWS_DEFAULT_REGION")
  name                = lower("${get_env("COMPANY_REF")}-${get_env("REPO_REF")}-${local.environment}")
  tags = {
    Name        = local.name
    Environment = local.environment
    Terraform   = "true"
  }

  root_path     = trimsuffix(get_repo_root(), "/")
  domain_prefix = local.environment == "prod" ? null : local.environment
  domain_name   = get_env("DOMAIN_NAME")

  longlived = contains(["prod", "stag"], local.environment)
  production = local.environment == "prod"
}

generate "versions" {
  path      = "version_override.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0.1"
    }
    docker = {
      source  = "kreuzwerker/docker"
      version = ">= 3.0"
    }
  }
  required_version = ">= 1.4.0"
}
  EOF
}

generate "provider" {
  path      = "provider_override.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
# Main region where the resources should be created in
# Should be close to the location of your viewers
provider "aws" {
  region = "${local.convention_vars.locals.account_region_name}"
  # Make it faster by skipping something
  # skip_metadata_api_check     = true
  # skip_region_validation      = true
  # skip_credentials_validation = true
}
provider "docker" {
  registry_auth {
    address  = format("%v.dkr.ecr.%v.amazonaws.com", data.aws_caller_identity.current.account_id, data.aws_region.current.name)
    username = data.aws_ecr_authorization_token.token.user_name
    password = data.aws_ecr_authorization_token.token.password
  }
}
EOF
}

remote_state {
  backend = "s3"
  config = {
    encrypt = true
    # key                 = "${path_relative_to_include()}/terraform.tfstate"
    key                 = "terraform.tfstate"
    region              = local.convention_vars.locals.account_region_name
    bucket              = lower(join("-", compact([local.convention_vars.locals.name, "tf-state"])))
    dynamodb_table      = lower(join("-", compact([local.convention_vars.locals.name, "tf-locks"])))
    s3_bucket_tags      = local.convention_vars.locals.tags
    dynamodb_table_tags = local.convention_vars.locals.tags
  }

  generate = {
    path      = "backend_override.tf"
    if_exists = "overwrite_terragrunt"
  }
}

terraform {
  # Force Terraform to keep trying to acquire a lock for some minutes if someone else already has the lock
  extra_arguments "retry_lock" {
    commands  = get_terraform_commands_that_need_locking()
    arguments = ["-lock-timeout=10m"]
  }

  source = "."
}

inputs = {
  name     = local.convention_vars.locals.name
  base_dir = "${local.root_path}/"

  domain = {
    zone   = local.domain_name
    prefix = local.domain_prefix
  }

  vpc = {
    cidr_ipv4 = "1.0.0.0/16"
  }

  microservice = {
    bucket_env = {
      content = <<EOT
NEXT_PUBLIC_API_URL=${get_env("NEXT_PUBLIC_API_URL")}
EOT
    }
    orchestrator = {
      group = {
        name = "ui"
        deployment = {
          min_size     = local.production ? 1 : 1
          max_size     = local.production ? 1 : 1
          desired_size = local.production ? 1 : 1

          containers = [
            {
              name = "next"
              docker = {
                repository = {
                  lifecycle_policy = jsonencode({
                    rules = [{
                      rulePriority = 1,
                      description  = "Keep last 30 images",
                      selection = {
                        tagStatus   = "any",
                        countType   = "imageCountMoreThan",
                        countNumber = 30
                      },
                      action = {
                        type = "expire"
                      }
                    }]
                  })
                }
                build = {
                  args = {
                    NEXT_PUBLIC_API_URL                = get_env("NEXT_PUBLIC_API_URL")
                    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = get_env("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")
                    STRIPE_SECRET_KEY                  = get_env("STRIPE_SECRET_KEY")
                  }
                  context_path = local.root_path
                  file_path    = "Dockerfile" # file_path from the context_path
                  path_include = ["**"]
                  path_exclude = ["**/node_modules/**", "**/.next/**"] # these are files to be ignored for generating a new image such as files in .gitignore
                }
              }

              traffics = [
                {
                  listener = {
                    protocol = "https"
                  }
                  target = {
                    port              = 3000
                    protocol          = "http" # if not specified, the protocol will be the same as the listener
                    health_check_path = "/"    # if not specified, the health_check_path will be "/"
                  }
                },
              ]
              readonly_root_filesystem = false
            }
          ]
        }

        ec2 = {
          instance_types = local.production ? ["t3.medium"] : ["t3.medium"]
          os             = "linux"
          os_version     = "2023"
          capacities = [{
            type = "ON_DEMAND"
          }]
          # schedules = {
          #   go-offline-at-rds-rotation = {
          #     min_size         = 0
          #     max_size         = 0
          #     desired_capacity = 0
          #     start_time       = "0 1 1 * ? *" # every month the 1st at 1am
          #     end_time         = "30 1 1 * ? *" # every month the 1st at 1:30am
          #   }
          # }
        }
      }
      ecs = {}
    }
  }

  tags = {
    Name        = local.convention_vars.locals.name
    Environment = local.convention_vars.locals.environment
    Terraform   = true
  }
}