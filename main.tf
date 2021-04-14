terraform {
  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "fostertheweb"

    workspaces {
      name = "crowdq"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

module "web" {
  source = "./web"
}

module "server" {
  source = "./server"
}
