terraform {
  required_providers {
    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = "1.15.0"
    }
  }
}

provider "mongodbatlas" {
  public_key  = var.atlas_public_key
  private_key = var.atlas_private_key
}

resource "mongodbatlas_project" "project" {
  name   = "linkup-atlas-project"
  org_id = var.atlas_org_id
}

resource "mongodbatlas_cluster" "cluster" {
  project_id                  = mongodbatlas_project.project.id
  name                        = "linkup-cluster"
  provider_name               = "AWS"
  provider_region_name        = "AF_SOUTH_1"
  provider_instance_size_name = "M0"
  mongo_db_major_version      = "6.0"
}

resource "mongodbatlas_database_user" "app_user" {
  project_id = mongodbatlas_project.project.id
  username   = var.mongo_username
  password   = var.mongo_password

  roles {
    role_name     = "readWrite"
    database_name = var.mongo_db_name
  }
  auth_database_name = "admin"
}

resource "mongodbatlas_project_ip_access_list" "access_ec2" {
  project_id = mongodbatlas_project.project.id
  cidr_block = aws_instance.app_instance.public_ip
  comment    = "Allow EC2 access"
}
