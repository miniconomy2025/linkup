import driver from "../../neo4js";
import { ActorActivitySummary } from "../models/actor";

export const ActorGraphRepository = {
  createActor: async (userId: string): Promise<void> => {
    const session = driver.session();
    try {
      await session.run(
        `
        MERGE (u:ACTOR {id: $id})
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
        MATCH (u:ACTOR {id: $id})
        OPTIONAL MATCH (u)-[:FOLLOWS]->(following:ACTOR)
        OPTIONAL MATCH (follower:ACTOR)-[:FOLLOWS]->(u)
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
        posts: record.get("posts").toNumber(),
      };
    } finally {
      await session.close();
    }
  },

  createPostForUser: async (postId: string, userId: string): Promise<void> => {
    const session = driver.session();
    try {
      await session.run(
        `
        MERGE (p:POST {id: $postId})
        WITH p
        MATCH (u:ACTOR {id: $userId})
        MERGE (u)-[:POSTED]->(p)
        `,
        { postId, userId }
      );
    } finally {
      await session.close();
    }
  },

  hasUserLikedPost: async (postId: string, userId: string): Promise<boolean> => {
    const session = driver.session();
    try {
      const result = await session.run(
        `
        MATCH (u:ACTOR {id: $userId})-[r:LIKES]->(p:POST {id: $postId})
        RETURN COUNT(r) > 0 AS liked
        `,
        { postId, userId }
      );

      const record = result.records[0];
      return record.get("liked");
    } finally {
      await session.close();
    }
  },

  createLikeForPost: async (postId: string, userId: string): Promise<void> => {
    const session = driver.session();
    try {
      await session.run(
        `
        MERGE (p:POST {id: $postId})
        WITH p
        MATCH (u:ACTOR {id: $userId})
        MERGE (u)-[:LIKES]->(p)
        `,
        { postId, userId }
      );
    } finally {
      await session.close();
    }
  },

  hasUserFollowedActor: async (followerId: string, followedActorId: string): Promise<boolean> => {
    const session = driver.session();
    try {
      const result = await session.run(
        `
        MATCH (follower:ACTOR {id: $followerId})-[r:FOLLOWS]->(target:ACTOR {id: $followedActorId})
        RETURN COUNT(r) > 0 AS hasFollowed
        `,
        { followerId, followedActorId }
      );

      const record = result.records[0];
      return record.get("hasFollowed");
    } finally {
      await session.close();
    }
  },

  createFollowActorActivity: async (followerId: string, followedActorId : string): Promise<void> => {
    const session = driver.session();
    try {
      await session.run(
        `
      MERGE (follower:ACTOR {id: $followerId})
      MERGE (target:ACTOR {id: $followedActorId})
      MERGE (follower)-[:FOLLOWS]->(target)
      `,
        { followerId, followedActorId }
      );
    } finally {
      await session.close();
    }
  },

  removeFollowActor: async (followerId: string, followedActorId: string): Promise<void> => {
    const session = driver.session();
    try {
      await session.run(
        `
        MATCH (follower:ACTOR {id: $followerId})-[r:FOLLOWS]->(target:ACTOR {id: $followedActorId})
        DELETE r
        `,
        { followerId, followedActorId }
      );
    } finally {
      await session.close();
    }
  },

  getFollowerIds: async (actorId: string): Promise<string[]> => {
    const session = driver.session();
    try {
      const result = await session.run(
        `
        MATCH (follower:ACTOR)-[:FOLLOWS]->(u:ACTOR {id: $id})
        RETURN follower.id AS id
        `,
        { id: actorId }
      );

      return result.records.map(record => record.get("id"));
    } finally {
      await session.close();
    }
  },

};
