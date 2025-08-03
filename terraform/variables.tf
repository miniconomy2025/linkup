variable "aws_region" {
  default = "af-south-1"
}

variable "key_name" {
  description = "EC2 key pair name"
  type        = string
}

variable "ami_id" {
  description = "AMI ID for af-south-1"
  type        = string
}

variable "instance_type" {
  default = "t3.micro"
}

variable "s3_bucket_name" {
  description = "S3 bucket name for object storage"
  type        = string
}

variable "budget_emails" {
  description = "List of email addresses to receive budget alerts"
  type        = list(string)
}

# MongoDB Atlas
variable "atlas_public_key" {}
variable "atlas_private_key" {}
variable "atlas_org_id" {}
variable "mongo_username" { default = "appuser" }
variable "mongo_password" {}
variable "mongo_db_name" { default = "linkup" }

# Neo4j Aura
variable "neo4j_client_id" {}
variable "neo4j_client_secret" {}
variable "neo4j_tenant_id" {}
variable "neo4j_instance_name" { default = "linkup-neo4j" }
