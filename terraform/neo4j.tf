terraform {
  required_providers {
    restapi = {
      source = "mastercard/restapi"
      version = "1.18.2"
    }
  }
}

data "http" "aura_auth" {
  url    = "https://api.neo4j.io/oauth/token"
  method = "POST"
  request_headers = {
    Authorization = "Basic ${base64encode("${var.neo4j_client_id}:${var.neo4j_client_secret}")}"
    "Content-Type" = "application/x-www-form-urlencoded"
  }
  request_body = "grant_type=client_credentials"
}

provider "restapi" {
  alias                 = "neo4j"
  uri                   = "https://api.neo4j.io"
  write_returns_object  = true
  headers = {
    Authorization = "Bearer ${jsondecode(data.http.aura_auth.response_body).access_token}"
    Content-Type  = "application/json"
  }
}

resource "restapi_object" "neo4j_instance" {
  provider       = restapi.neo4j
  path           = "/v1/instances"
  id_attribute   = "data/id"
  create_method  = "POST"
  destroy_method = "DELETE"
  destroy_path   = "/v1/instances/{id}"

  data = jsonencode({
    name           = var.neo4j_instance_name
    region         = "AWS_AF_SOUTH_1"
    cloud_provider = "AWS"
    type           = "AuraDB.Free"
    tenant_id      = var.neo4j_tenant_id
    version        = "5"
    memory         = "0.25G"
  })
}
