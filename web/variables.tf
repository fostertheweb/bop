variable "application" {
  type = string
  default = "crowdq-fm"
}

variable "domain_name" {
  type = string
  default = "crowdq.fm"
}

variable "spotify_api_url" {
  type = string
  default = "https://api.spotify.com/v1"
}

variable "api_url" {
  type = string
  default = "http://localhost:4000"
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
