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
  default = "t3.medium"
}

variable "s3_bucket_name" {
  description = "S3 bucket name for object storage"
  type        = string
}

variable "budget_emails" {
  description = "List of email addresses to receive budget alerts"
  type        = list(string)
}
