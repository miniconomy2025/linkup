module.exports = {
  async up(db, client) {
    await db.createCollection("comments", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["iri", "actorIri", "inReplyTo", "published", "content"],
          properties: {
            iri: { bsonType: "string" },
            actorIri: { bsonType: "string" },
            inReplyTo: { bsonType: "string" },
            content: { bsonType: "string" },
            published: { bsonType: "date" },
            to: {
              bsonType: ["array"],
              items: { bsonType: "string" }
            },
            cc: {
              bsonType: ["array"],
              items: { bsonType: "string" }
            },
            createdAt: { bsonType: ["date","null"] }
          }
        }
      },
      validationLevel: "moderate",
      validationAction: "error"
    });

    await db.collection("comments").createIndex({ iri: 1 }, { unique: true });
    await db.collection("comments").createIndex({ inReplyTo: 1, published: 1 });
  },

  async down(db, client) {
    await db.collection("comments").drop();
  }
}; 