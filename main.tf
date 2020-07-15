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

locals {
  common_tags = {
    project = var.application
  }
}

data "aws_route53_zone" "selected" {
  name = "${var.domain_name}."
}

#ACM
resource "aws_acm_certificate" "cert" {
  domain_name       = var.domain_name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = local.common_tags
}

resource "aws_route53_record" "cert_validation" {
  name    = aws_acm_certificate.cert.domain_validation_options.0.resource_record_name
  type    = aws_acm_certificate.cert.domain_validation_options.0.resource_record_type
  zone_id = data.aws_route53_zone.selected.id
  records = [aws_acm_certificate.cert.domain_validation_options.0.resource_record_value]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "cert" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [aws_route53_record.cert_validation.fqdn]
}

module "web" {
  source = "./web"

  application = var.application
  domain_name = var.domain_name
  cert_arn    = aws_acm_certificate.cert.arn
}

module "server" {
  source = "./server"

  application           = var.application
  domain_name           = var.domain_name
  cert_arn              = aws_acm_certificate.cert.arn
  spotify_client_id     = var.spotify_client_id
  spotify_client_secret = var.spotify_client_secret
  redis_host            = var.redis_host
  redis_port            = var.redis_port
  redis_password        = var.redis_password
}
