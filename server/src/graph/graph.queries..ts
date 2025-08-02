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

export async function createUser(userId: string): Promise<void> {
  const session = driver.session();
  try {
    await session.run(
      `
      MERGE (u:User {id: $id})
      RETURN u
      `,
      { id: userId }
    );
  } finally {
    await session.close();
  }
}

export async function createPostForUser(postId: string, userId: string): Promise<void> {
  const session = driver.session();
  try {
    await session.run(
      `
      MERGE (p:POST {id: $postId})
      WITH p
      MATCH (u:User {id: $userId})
      MERGE (u)-[:POSTED]->(p)
      `,
      { postId, userId }
    );
  } finally {
    await session.close();
  }
}