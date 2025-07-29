terraform {
  backend "s3" {
    bucket         = "linkup-terraform-state-bucket"
    key            = "infra/terraform.tfstate"
    region         = var.aws_region
    encrypt        = true
  }
}