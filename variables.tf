variable "application" {
  default = "crowdq-fm"
  type    = string
}

variable "domain_name" {
  default = "crowdq.fm"
  type    = string
}

variable "api_endpoint" {
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
