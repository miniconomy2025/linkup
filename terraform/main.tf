terraform {
  required_providers {
    restapi = {
      source  = "mastercard/restapi"
      version = "1.18.2"
    }
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.34.0"
    }
  }
}

data "aws_vpc" "default" {
  default = true
}

data "aws_ssm_parameter" "ubuntu2204" {
  name   = "/aws/service/canonical/ubuntu/server/jammy/stable/current/amd64/hvm/ebs-gp2/ami-id"
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
    description = "Neo4j Browser HTTPS"
    from_port   = 7473
    to_port     = 7473
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
  ami                         = data.aws_ssm_parameter.ubuntu2204.value
  instance_type               = var.instance_type
  key_name                    = var.key_name
  security_groups             = [aws_security_group.app_sg.name]
  associate_public_ip_address = true

  user_data = templatefile("user-data.tpl.sh", {
    neo4j_uri      = var.neo4j_uri
    neo4j_username = var.neo4j_user
    neo4j_password = var.neo4j_password
  })

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
