variable "application" {
  type = string
}

variable "domain_name" {
  type = string
}

variable "cert_arn" {
  type = string
}

variable "client_mime_types" {
  default = {
    html  = "text/html"
    css   = "text/css"
    js    = "application/javascript"
    map   = "application/javascript"
    json  = "application/json"
    txt   = "text/plain"
    ico   = "image/x-icon"
    png   = "image/png"
    ttf   = "font/ttf"
    otf   = "font/otf"
    eot   = "font/eot"
    svg   = "image/svg+xml"
    woff  = "font/woff"
    woff2 = "font/woff2"
  }
}
