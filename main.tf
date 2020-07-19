terraform {
  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "fostertheweb"

    workspaces {
      name = "crowdq-fm"
    }
  }
}

provider "aws" {
  version = "~> 2.0"
  region  = "us-east-1"
}

module "web" {
  source = "./web"

  application           = var.application
  domain_name           = var.domain_name
  api_endpoint          = module.server.api_endpoint
  spotify_client_id     = var.spotify_client_id
  spotify_client_secret = var.spotify_client_secret
}

module "server" {
  source = "./server"

  application           = var.application
  domain_name           = var.domain_name
  spotify_client_id     = var.spotify_client_id
  spotify_client_secret = var.spotify_client_secret
  redis_host            = var.redis_host
  redis_port            = var.redis_port
  redis_password        = var.redis_password
}
