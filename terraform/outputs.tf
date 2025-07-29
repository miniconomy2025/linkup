output "instance_public_ip" {
  value = aws_instance.app_instance.public_ip
}

output "ssh_command" {
  value = "ssh -i your-key.pem ubuntu@${aws_instance.app_instance.public_ip}"
}
