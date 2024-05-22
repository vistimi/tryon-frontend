variable "name" {
  description = "The name"
  type        = string
}

variable "longlived" {
  description = "If the bucket should be long lived"
  type        = bool
  default     = false
}

variable "domain" {
  type = object({
    zone   = string
    prefix = optional(string)
  })
}

variable "retention_in_days" {
  type    = number
  default = 31
}

variable "vpc" {
  type = object({
    cidr_ipv4 = string
    az_max    = optional(number)
    nat       = optional(string)
  })
}

variable "microservice" {
  type = object({
    bucket_env = object({
      content     = string
    })
    orchestrator = object({
      group = object({
        name = string
        deployment = object({
          min_size        = number
          max_size        = number
          desired_size    = number
          maximum_percent = optional(number)
          cpu             = optional(number)
          memory          = optional(number)

          containers = list(object({
            name        = string
            cpu         = optional(number)
            memory      = optional(number)
            device_idxs = optional(list(number))
            environments = optional(list(object({
              name  = string
              value = string
            })), [])
            docker = object({
              registry = optional(object({
                name = optional(string)
                ecr = optional(object({
                  privacy      = string
                  public_alias = optional(string, "")
                  account_id   = optional(string)
                  region_name  = optional(string)
                }))
              }))
              repository = optional(object({
                name             = optional(string)
                lifecycle_policy = optional(string)
              }))
              image = optional(object({
                tag = string
              }))
              build = optional(object({
                args         = optional(map(string))
                file_path    = optional(string)
                context_path = optional(string)
                path_include = optional(list(string))
                path_exclude = optional(list(string))
              }))
            })
            traffics = optional(list(object({
              listener = object({
                protocol         = string
                port             = optional(number)
                protocol_version = optional(string)
              })
              target = object({
                protocol          = optional(string)
                port              = number
                protocol_version  = optional(string)
                health_check_path = optional(string)
                status_code       = optional(string)
              })
            })), [])
            command                  = optional(list(string), [])
            entrypoint               = optional(list(string), [])
            readonly_root_filesystem = optional(bool)
            user                     = optional(string)
            mount_points = optional(list(object({
              s3 = optional(object({
                name = string
              }))
              container_path = string
              read_only      = optional(bool)
            })))
          }))
        })
        ec2 = optional(object({
          key_name       = optional(string)
          instance_types = list(string)
          os             = string
          os_version     = string

          capacities = optional(list(object({
            type   = optional(string, "ON_DEMAND")
            base   = optional(number)
            weight = optional(number, 1)
            })), [{
            type   = "ON_DEMAND"
            weight = 1
          }])
        }))
        fargate = optional(object({
          os           = string
          architecture = string

          capacities = optional(list(object({
            type   = optional(string, "ON_DEMAND")
            base   = optional(number)
            weight = optional(number, 1)
            })), [{
            type   = "ON_DEMAND"
            weight = 1
          }])
        }))
      })
      ecs = optional(object({}))
    })
  })
}

variable "tags" {
  description = "Custom tags to set on the Instances in the ASG"
  type        = map(string)
  default     = {}
}