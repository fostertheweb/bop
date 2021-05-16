locals {
  common_tags = {
    project = var.application
  }
}

data "aws_secretsmanager_secret" "config" {
  name = "${var.application}-config"
}

data "aws_secretsmanager_secret_version" "config" {
  secret_id = data.aws_secretsmanager_secret.config.id
}

resource "aws_s3_bucket" "dist" {
  bucket = "${var.application}-server-dist"
  acl    = "private"

  tags = local.common_tags
}
