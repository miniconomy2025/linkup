provider "restapi" {
  alias = "neo4j"
  uri   = "https://api.neo4j.io"

  headers = {
    "Content-Type" = "application/json"
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
    tenant_id      = ""
    version        = "5"
    memory         = "0.25G"
  })
}