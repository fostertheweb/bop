variable "application" {
  type = string
}

variable "domain_name" {
  type = string
}

variable "spotify_client_id" {
  type = string
}

variable "spotify_client_secret" {
  type = string
}

variable "redis_host" {
  type = string
}

variable "redis_port" {
  type = string
}

variable "redis_password" {
  type = string
}

variable "instance_ami" {
  type = string
  default = "ami-0742b4e673072066f"
}
