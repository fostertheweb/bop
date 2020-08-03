locals {
  common_tags = {
    project = var.application
  }
}

data "aws_iam_policy_document" "lambda" {
  statement {
    sid = "AssumeRole"
    actions = [
      "sts:AssumeRole"
    ]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "lambda_logs" {
  statement {
    sid = "AllowCloudWatchLogs"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    effect = "Allow"
    resources = [
      "arn:aws:logs:*:*:*"
    ]
  }
}

resource "aws_iam_policy" "lambda_logs" {
  name   = "${var.application}-lambda-logs"
  policy = data.aws_iam_policy_document.lambda_logs.json
}

data "aws_iam_policy_document" "manage_connections" {
  statement {
    sid = "AllowManageConnections"
    actions = [
      "execute-api:ManageConnections"
    ]
    effect = "Allow"
    resources = [
      "arn:aws:execute-api:*:*:*/@connections/*"
    ]
  }
}

resource "aws_iam_policy" "manage_connections" {
  name   = "${var.application}-manage-connections"
  policy = data.aws_iam_policy_document.manage_connections.json
}

resource "aws_iam_role" "lambda" {
  name               = "${var.application}-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.lambda.json
}

resource "aws_iam_role_policy_attachment" "manage_connections" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.manage_connections.arn
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.lambda_logs.arn
}

data "archive_file" "server" {
  type        = "zip"
  source_dir  = "./server/dist"
  output_path = "./server/lambda.zip"
}

resource "aws_lambda_function" "server" {
  filename         = "./server/lambda.zip"
  function_name    = "${var.application}-server"
  role             = aws_iam_role.lambda.arn
  handler          = "handler.handler"
  source_code_hash = data.archive_file.server.output_base64sha256
  runtime          = "nodejs12.x"

  environment {
    variables = {
      SPOTIFY_CLIENT_ID         = var.spotify_client_id
      SPOTIFY_CLIENT_SECRET     = var.spotify_client_secret
      SPOTIFY_AUTH_API_BASE_URL = "https://accounts.spotify.com"
      REDIS_HOST                = var.redis_host
      REDIS_PORT                = var.redis_port
      REDIS_PASSWORD            = var.redis_password
    }
  }

  tags = local.common_tags
}

resource "aws_lambda_function" "messages" {
  filename         = "./server/lambda.zip"
  function_name    = "${var.application}-messages"
  role             = aws_iam_role.lambda.arn
  handler          = "handler.messages"
  source_code_hash = data.archive_file.server.output_base64sha256
  runtime          = "nodejs12.x"

  environment {
    variables = {
      REDIS_HOST     = var.redis_host
      REDIS_PORT     = var.redis_port
      REDIS_PASSWORD = var.redis_password
    }
  }

  tags = local.common_tags
}

resource "aws_api_gateway_rest_api" "server" {
  name = "${var.application}-api"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.server.id
  parent_id   = aws_api_gateway_rest_api.server.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "any" {
  rest_api_id   = aws_api_gateway_rest_api.server.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id             = aws_api_gateway_rest_api.server.id
  resource_id             = aws_api_gateway_resource.proxy.id
  http_method             = aws_api_gateway_method.any.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.server.invoke_arn
}

resource "aws_api_gateway_deployment" "server" {
  rest_api_id = aws_api_gateway_rest_api.server.id

  triggers = {
    redeployment = sha1(join(",", list(
      jsonencode(aws_api_gateway_integration.lambda),
    )))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "prod" {
  rest_api_id   = aws_api_gateway_rest_api.server.id
  stage_name    = "prod"
  deployment_id = aws_api_gateway_deployment.server.id
}

resource "aws_lambda_permission" "rest" {
  statement_id  = "AllowAPIGatewayInvokeLambda"
  action        = "lambda:InvokeFunction"
  function_name = "${var.application}-server"
  principal     = "apigateway.amazonaws.com"

  # The /*/*/* part allows invocation from any stage, method and resource path
  # within API Gateway REST API.
  source_arn = "${aws_api_gateway_rest_api.server.execution_arn}/*/*/*"
}

resource "aws_apigatewayv2_api" "websocket_server" {
  name          = "${var.application}-websocket-api"
  protocol_type = "WEBSOCKET"
  target        = aws_lambda_function.messages.arn

  tags = local.common_tags
}

resource "aws_apigatewayv2_stage" "prod" {
  api_id      = aws_apigatewayv2_api.websocket_server.id
  name        = "prod"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id             = aws_apigatewayv2_api.websocket_server.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.messages.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "default" {
  api_id    = aws_apigatewayv2_api.websocket_server.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_lambda_permission" "websocket" {
  statement_id  = "AllowAPIGatewayWebSocketInvokeLambda"
  action        = "lambda:InvokeFunction"
  function_name = "${var.application}-messages"
  principal     = "apigateway.amazonaws.com"
}
