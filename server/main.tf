locals {
  common_tags = {
    project = var.application
  }

  config = {
    spotify_client_id     = jsondecode(data.aws_secretsmanager_secret_version.config.secret_string)["SPOTIFY_CLIENT_ID"]
    spotify_client_secret = jsondecode(data.aws_secretsmanager_secret_version.config.secret_string)["SPOTIFY_CLIENT_SECRET"]
    discord_bot_token     = jsondecode(data.aws_secretsmanager_secret_version.config.secret_string)["DISCORD_BOT_TOKEN"]
    redis_host            = jsondecode(data.aws_secretsmanager_secret_version.config.secret_string)["REDIS_HOST"]
    redis_port            = jsondecode(data.aws_secretsmanager_secret_version.config.secret_string)["REDIS_PORT"]
    redis_password        = jsondecode(data.aws_secretsmanager_secret_version.config.secret_string)["REDIS_PASSWORD"]
    youtube_api_key       = jsondecode(data.aws_secretsmanager_secret_version.config.secret_string)["YOUTUBE_API_KEY"]
  }
}

data "aws_secretsmanager_secret" "config" {
  name = "${var.application}-config"
}

data "aws_secretsmanager_secret_version" "config" {
  secret_id = data.aws_secretsmanager_secret.config.id
}

resource "null_resource" "build" {
  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = "yarn workspace server run build"
  }
}

data "archive_file" "dist_zip" {
  type        = "zip"
  source_dir  = "./server/dist"
  output_path = "./server/dist.zip"

  depends_on = [
    null_resource.build
  ]
}

resource "aws_s3_bucket" "dist" {
  bucket = "${var.application}-server-dist"
  acl    = "private"


  tags = local.common_tags
}

resource "aws_s3_bucket_object" "dist" {
  key    = "dist.zip"
  bucket = aws_s3_bucket.dist.id
  source = "./server/dist.zip"
  etag   = data.archive_file.dist_zip.output_md5

  depends_on = [aws_s3_bucket.dist, data.archive_file.dist_zip]
}

# resource "aws_instance" "app_server" {
#   ami = var.instance_ami
#   instance_type = "t2.micro"

#   tags = local.common_tags
# }
