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

data "cloudinit_config" "app_config" {
  gzip          = false
  base64_encode = false

  part {
    content_type = "text/cloud-config"
    content = templatefile("./server/config/cloud-init.tpl", {
      spotify_client_id     = jsondecode(data.aws_secretsmanager_secret_version.config.secret_string)["SPOTIFY_CLIENT_ID"]
      spotify_client_secret = jsondecode(data.aws_secretsmanager_secret_version.config.secret_string)["SPOTIFY_CLIENT_SECRET"]
      discord_bot_token     = jsondecode(data.aws_secretsmanager_secret_version.config.secret_string)["DISCORD_BOT_TOKEN"]
      redis_host            = jsondecode(data.aws_secretsmanager_secret_version.config.secret_string)["REDIS_HOST"]
      redis_port            = jsondecode(data.aws_secretsmanager_secret_version.config.secret_string)["REDIS_PORT"]
      redis_password        = jsondecode(data.aws_secretsmanager_secret_version.config.secret_string)["REDIS_PASSWORD"]
      youtube_api_key       = jsondecode(data.aws_secretsmanager_secret_version.config.secret_string)["YOUTUBE_API_KEY"]
      dist_s3_uri           = "s3://${aws_s3_bucket.dist.id}/dist.zip"
    })
  }
}

data "aws_security_group" "selected" {
  name = "${var.application}-sg"
}

resource "aws_instance" "app_server" {
  ami                    = var.instance_ami
  instance_type          = "t2.micro"
  iam_instance_profile   = "crowdq-fm-instance-role"
  vpc_security_group_ids = [data.aws_security_group.selected.id]
  key_name               = "${var.application}-ec2"

  root_block_device {
    volume_size           = 8
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = data.cloudinit_config.app_config.rendered

  tags = local.common_tags
}
