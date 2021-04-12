output "api_endpoint" {
  value = aws_api_gateway_deployment.server.invoke_url
}
