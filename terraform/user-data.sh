#!/bin/bash
set -e

# Update and install prerequisites
apt update -y && apt upgrade -y
apt install -y curl wget gnupg unzip software-properties-common

# Node.js (v18)
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# MongoDB
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb.gpg
echo "deb [ signed-by=/usr/share/keyrings/mongodb.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt update && apt install -y mongodb-org
systemctl start mongod && systemctl enable mongod

# Neo4j
wget -O - https://debian.neo4j.com/neotechnology.gpg.key | gpg --dearmor -o /usr/share/keyrings/neo4j.gpg
echo "deb [signed-by=/usr/share/keyrings/neo4j.gpg] https://debian.neo4j.com stable 5" | tee /etc/apt/sources.list.d/neo4j.list
apt update && apt install -y neo4j
systemctl enable neo4j && systemctl start neo4j

# Done
echo "Setup complete."
