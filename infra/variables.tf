variable "name" {
  description = "The name"
  type        = string
}

variable "global_region" {
  type    = string
  default = "us-east-1"
}

variable "domain" {
  type = object({
    zone   = string
    prefix = optional(string)
  })
}

variable "base_dir" {
  description = "The base directory of the next.js app"
  type        = string
}

variable "retention_in_days" {
  type    = number
  default = 14
}

variable "env" {
  description = "stripe configuration"
  type = object({
    NEXT_PUBLIC_API_URL    = string
  })
  sensitive = true
}

variable "tags" {
  description = "Custom tags to set on the Instances in the ASG"
  type        = map(string)
  default     = {}
}