output "api_endpoint" {
  value = aws_api_gateway_deployment.server.invoke_url
}

output "websocket_api_endpoint" {
  value = aws_apigatewayv2_stage.prod.invoke_url
}
