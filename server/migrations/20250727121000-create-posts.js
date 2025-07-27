module.exports = {
  async up(db, client) {
    await db.createCollection("posts", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["iri", "actorIri", "url", "published"],
          properties: {
            iri: { bsonType: "string" },
            actorIri: { bsonType: "string" },
            url: { bsonType: "string" },
            content: { bsonType: ["string","null"] },
            published: { bsonType: "date" },
            to: {
              bsonType: ["array"],
              items: { bsonType: "string" }
            },
            cc: {
              bsonType: ["array"],
              items: { bsonType: "string" }
            },
            createdAt: { bsonType: ["date","null"] },
            updatedAt: { bsonType: ["date","null"] }
          }
        }
      },
      validationLevel: "moderate",
      validationAction: "error"
    });

    await db.collection("posts").createIndex({ iri: 1 }, { unique: true });
    await db.collection("posts").createIndex({ actorIri: 1, published: -1 });
    await db.collection("posts").createIndex({ published: -1 });
  },

  async down(db, client) {
    await db.collection("posts").drop();
  }
}; 