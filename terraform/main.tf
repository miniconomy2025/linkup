provider "aws" {
  region = var.aws_region
}

data "aws_vpc" "default" {
  default = true
}

resource "aws_security_group" "app_sg" {
  name        = "linkup_app_sg"
  description = "Allow web, SSH, MongoDB, Neo4j ports"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Neo4j Browser"
    from_port   = 7474
    to_port     = 7474
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Neo4j Bolt"
    from_port   = 7687
    to_port     = 7687
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "MongoDB"
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "linkup-app-sg"
  }
}

resource "aws_instance" "app_instance" {
  ami                         = var.ami_id
  instance_type               = var.instance_type
  key_name                    = var.key_name
  security_groups             = [aws_security_group.app_sg.name]
  associate_public_ip_address = true

  user_data = file("user-data.sh")

  tags = {
    Name = "linkup-app-ec2"
  }
}

resource "aws_s3_bucket" "linkup_app_bucket" {
  bucket = var.s3_bucket_name

  tags = {
    Name        = "linkup-bucket"
    Environment = "production"
  }
}

resource "aws_budgets_budget" "monthly_budget" {
  name              = "link-up-monthly-budget"
  budget_type       = "COST"
  limit_amount      = "25"
  limit_unit        = "USD"
  time_unit         = "MONTHLY"

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 25
    threshold_type             = "PERCENTAGE"
    notification_type          = "FORECASTED"
    subscriber_email_addresses = var.budget_emails
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 50
    threshold_type             = "PERCENTAGE"
    notification_type          = "FORECASTED"
    subscriber_email_addresses = var.budget_emails
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 75
    threshold_type             = "PERCENTAGE"
    notification_type          = "FORECASTED"
    subscriber_email_addresses = var.budget_emails
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "FORECASTED"
    subscriber_email_addresses = var.budget_emails
  }
}

resource "aws_s3_bucket" "tf_state" {
  bucket = "linkup-terraform-state-bucket"
}