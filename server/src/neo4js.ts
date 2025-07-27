import neo4j, { Driver } from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();
const NEO4J_URI = process.env.NEO4J_URI
const NEO4J_USER = process.env.NEO4J_USER 
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;
const driver: Driver = neo4j.driver(
  NEO4J_URI!,
  neo4j.auth.basic(NEO4J_USER!, NEO4J_PASSWORD!)
);

export default driver;
