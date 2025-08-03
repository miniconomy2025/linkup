output "instance_public_ip" {
  value = aws_instance.app_instance.public_ip
}

output "ssh_command" {
  value = "ssh -i your-key.pem ubuntu@${aws_instance.app_instance.public_ip}"
}

output "mongo_connection_string" {
  value = mongodbatlas_cluster.cluster.connection_strings_standard_srv
}

output "neo4j_instance_id" {
  value = restapi_object.neo4j_instance.data["id"]
}
