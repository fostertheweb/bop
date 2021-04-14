locals {
  common_tags = {
    project = var.application
  }

  config = {
    spotify_client_id     = jsondecode(data.aws_secretsmanager_secret_version.config.secret_string)["SPOTIFY_CLIENT_ID"]
    spotify_client_secret = jsondecode(data.aws_secretsmanager_secret_version.config.secret_string)["SPOTIFY_CLIENT_SECRET"]
  }
}

data "aws_route53_zone" "selected" {
  name = "${var.domain_name}."
}

data "aws_secretsmanager_secret" "config" {
  name = "${var.application}-config"
}

data "aws_secretsmanager_secret_version" "config" {
  secret_id = data.aws_secretsmanager_secret.config.id
}

resource "aws_acm_certificate" "cert" {
  domain_name               = var.domain_name
  validation_method         = "DNS"
  subject_alternative_names = ["*.${var.domain_name}"]

  lifecycle {
    create_before_destroy = true
  }

  tags = local.common_tags
}

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for options in aws_acm_certificate.cert.domain_validation_options : options.domain_name => {
      name   = options.resource_record_name
      type   = options.resource_record_type
      record = options.resource_record_value
    }
  }

  name            = each.value.name
  records         = [each.value.record]
  type            = each.value.type
  zone_id         = data.aws_route53_zone.selected.id
  ttl             = 60
  allow_overwrite = true

  depends_on = [
    data.aws_route53_zone.selected,
    aws_acm_certificate.cert
  ]
}

resource "aws_acm_certificate_validation" "cert" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

# Client
resource "null_resource" "build" {
  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = "yarn workspace web run build"
    environment = {
      REACT_APP_SPOTIFY_CLIENT_ID     = local.config.spotify_client_id
      REACT_APP_SPOTIFY_CLIENT_SECRET = local.config.spotify_client_secret
      REACT_APP_API_URL               = var.api_url
      REACT_APP_SPOTIFY_API_URL       = var.spotify_api_url
    }
  }
}

resource "aws_s3_bucket" "web" {
  bucket = var.domain_name
  acl    = "public-read"

  website {
    index_document = "index.html"
    error_document = "index.html"
  }

  tags = local.common_tags
}

resource "aws_s3_bucket_object" "web_build" {
  for_each = fileset("./web/build", "**")

  bucket       = aws_s3_bucket.web.id
  key          = each.value
  source       = "./web/build/${each.value}"
  etag         = filemd5("./web/build/${each.value}")
  content_type = lookup(var.client_mime_types, split(".", each.value)[length(split(".", each.value)) - 1])

  depends_on = [aws_s3_bucket.web, null_resource.build]
}

data "aws_iam_policy_document" "s3_policy" {
  statement {
    sid       = "1"
    effect    = "Allow"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.web.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.access_identity.iam_arn]
    }
  }

  statement {
    sid       = "2"
    effect    = "Allow"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.web.arn}/*"]

    principals {
      type        = "*"
      identifiers = ["*"]
    }
  }
}

resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = aws_s3_bucket.web.id
  policy = data.aws_iam_policy_document.s3_policy.json
}

# Cloudfront
resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.application}-cdn"
  default_root_object = "index.html"

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  origin {
    origin_id   = "${var.domain_name}-bucket"
    domain_name = aws_s3_bucket.web.bucket_regional_domain_name

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.access_identity.cloudfront_access_identity_path
    }
  }

  aliases = [var.domain_name, "www.${var.domain_name}"]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "${var.domain_name}-bucket"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.cert.arn
    minimum_protocol_version = "TLSv1.1_2016"
    ssl_support_method       = "sni-only"
  }

  tags = local.common_tags

  depends_on = [aws_s3_bucket.web]
}

resource "aws_cloudfront_origin_access_identity" "access_identity" {
  comment = "${var.application}-access-identity"
}

# Route53
resource "aws_route53_record" "web" {
  zone_id = data.aws_route53_zone.selected.zone_id
  name    = data.aws_route53_zone.selected.name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.cdn.domain_name
    zone_id                = aws_cloudfront_distribution.cdn.hosted_zone_id
    evaluate_target_health = false
  }

  depends_on = [aws_cloudfront_distribution.cdn]
}
