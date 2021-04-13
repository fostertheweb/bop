variable "application" {
  type = string
  default = "crowdq-fm"
}

variable "domain_name" {
  type = string
  default = "crowdq.fm"
}

variable "spotify_auth_url"{
  type = string
  default = "https://accounts.spotify.com"
}

variable "instance_ami" {
  type = string
  default = "ami-0742b4e673072066f"
}
