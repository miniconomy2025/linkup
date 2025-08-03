resource "aws_docdb_subnet_group" "docdb_subnet_group" {
  name       = "linkup-docdb-subnet-group"
  subnet_ids = data.aws_vpc.default.id

  tags = {
    Name = "linkup-docdb-subnet-group"
  }
}


resource "aws_security_group" "docdb_sg" {
  name        = "linkup-docdb-sg"
  description = "Allow access to DocumentDB from app EC2"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port       = 27017
    to_port         = 27017
    protocol        = "tcp"
    security_groups = [aws_security_group.app_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_docdb_cluster" "docdb_cluster" {
  cluster_identifier      = "linkup-docdb-cluster"
  engine                 = "docdb"
  master_username        = var.mongo_username
  master_password        = var.mongo_password
  db_subnet_group_name   = aws_docdb_subnet_group.docdb_subnet_group.name
  vpc_security_group_ids = [aws_security_group.docdb_sg.id]
  backup_retention_period = 5
  preferred_backup_window = "07:00-09:00"
  apply_immediately       = true
  skip_final_snapshot     = true
}


resource "aws_docdb_cluster_instance" "docdb_instance" {
  identifier        = "linkup-docdb-instance-1"
  cluster_identifier = aws_docdb_cluster.docdb_cluster.id
  instance_class    = "db.t3.medium"
  engine            = aws_docdb_cluster.docdb_cluster.engine
  apply_immediately = true
}
