terraform {
  backend "s3" {
    bucket         = "linkup-terraform-state-bucket"
    key            = "infra/terraform.tfstate"
    region         = "af-south-1"
    encrypt        = true
  }
}