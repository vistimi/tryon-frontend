locals {
  env_file_content = sensitive(var.microservice.bucket_env.content)
}

resource "local_file" "env" {
  content  = local.env_file_content
  filename = "${path.module}/.env"
}

resource "random_id" "rng" {
  keepers = {
    first = "${timestamp()}"
  }
  byte_length = 8
}