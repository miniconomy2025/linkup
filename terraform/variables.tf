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

variable "atlas_public_key" {
  description = "MongoDB Atlas public API key"
  type        = string
  sensitive   = true
}

variable "atlas_private_key" {
  description = "MongoDB Atlas private API key"
  type        = string
  sensitive   = true
}

variable "atlas_org_id" {
  description = "MongoDB Atlas Organisation ID"
  type        = string
  sensitive   = true
}

variable "mongo_username" {
  default = "linkupuser"
}

variable "mongo_password" {
  description = "MongoDB Atlas password"
  type        = string
  sensitive   = true
}

variable "mongo_db_name" {
  default = "linkup"
}

variable "neo4j_username" {
  default = "neo4j"
}

variable "neo4j_password" {
  description = "Neo4J password"
  type        = string
  sensitive   = true
}

variable "neo4j_instance_uri" {}

variable "neo4j_instance_name" {
  default = "linkup-neo4j"
}
