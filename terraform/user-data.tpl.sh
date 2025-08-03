#!/bin/bash
set -e

# Update and install essentials
apt update -y && apt upgrade -y
apt install -y curl wget gnupg unzip software-properties-common

# Node.js (v22)
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# PM2 for managing Node apps
npm install -g pm2

# Install Nginx for serving frontend
apt install -y nginx

# Export Neo4j env variables
echo "export NEO4J_URI=\"${neo4j_uri}\"" >> /etc/profile.d/neo4j.sh
echo "export NEO4J_USERNAME=\"${neo4j_username}\"" >> /etc/profile.d/neo4j.sh
echo "export NEO4J_PASSWORD=\"${neo4j_password}\"" >> /etc/profile.d/neo4j.sh

echo "Node.js and PM2 installed. Ready for app deployment."
