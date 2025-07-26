import driver from "../neo4js";

export async function getAllUsers(): Promise<any[]> {
  const session = driver.session();
  try {
    const result = await session.run(`MATCH (u:User) RETURN u`);
    return result.records.map(record => record.get('u').properties);
  } finally {
    await session.close();
  }
}

export async function createUser(userId: string, username: string): Promise<void> {
  const session = driver.session();
  try {
    await session.run(
      `
      CREATE (u:User {id: $id, username: $username})
      RETURN u
      `,
      { id: userId, username }
    );
  } finally {
    await session.close();
  }
}

