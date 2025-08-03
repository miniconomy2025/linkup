import driver from "../../neo4js";
import { ActorActivitySummary } from "../models/actor";

export const ActorGraphRepository = {
  createActor: async (userId: string): Promise<void> => {
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
  },

  getActivitySummary: async (
    userId: string
  ): Promise<ActorActivitySummary> => {
    const session = driver.session();
    try {
      const result = await session.run(
        `
        MATCH (u:User {id: $id})
        OPTIONAL MATCH (u)-[:FOLLOW]->(following:User)
        OPTIONAL MATCH (follower:User)-[:FOLLOW]->(u)
        OPTIONAL MATCH (u)-[:POSTED]->(post)
        RETURN 
        count(DISTINCT following) AS following,
        count(DISTINCT follower) AS followers,
        count(DISTINCT post) AS posts
        `,
        { id: userId }
      );

      const record = result.records[0];
      return {
        followers: record.get("followers").toNumber(),
        following: record.get("following").toNumber(),
        posts: record.get("following").toNumber(),
      };
    } finally {
      await session.close();
    }
  },

  createPostForUser: async (postId: string, userId: string) => {
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
  },

  createLikeForPost: async (postId: string, userId: string) => {
    const session = driver.session();
    try {
      await session.run(
        `
        MERGE (p:POST {id: $postId})
        WITH p
        MATCH (u:User {id: $userId})
        MERGE (u)-[:LIKES]->(p)
        `,
        { postId, userId }
      );
    } finally {
      await session.close();
    }
  },
  createFollowActorActivity: async (followerId: string, followedActorId : string): Promise<void> => {
    const session = driver.session();
    try {
      await session.run(
        `
      MERGE (follower:User {id: $followerId})
      MERGE (target:User {id: $followedActorId})
      MERGE (follower)-[:FOLLOWS]->(target)
      `,
        { followerId, followedActorId }
      );
    } finally {
      await session.close();
    }
  },
};
