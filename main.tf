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

provider "null" {
  version = "2.1.2"
}

module "web" {
  source = "./web"
}

module "server" {
  source = "./server"
}
