locals {
  common_tags = {
    project = var.application
  }
}

data "aws_ami" "amazonlinux" {
  most_recent = true
  owners = [ "amazon" ]

  filter {
    name = "platform"
    values = ["amazonlinux"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  filter {
    name = "architecture"
    values = ["x86_64"]
  }
}

resource "aws_instance" "app_server" {
  ami = var.instance_ami
  instance_type = "t2.micro"

  tags = {
    project = local.common_tags.project
  }
}
