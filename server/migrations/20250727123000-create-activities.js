module.exports = {
  async up(db, client) {
    await db.createCollection("activities", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["ownerIri", "boxType", "activity"],
          properties: {
            ownerIri: { bsonType: "string" },
            boxType: {
              enum: ["inbox","outbox"],
              description: "must be either 'inbox' or 'outbox'"
            },
            activity: { bsonType: "object" },
            receivedAt: { bsonType: ["date","null"] },
            delivered: { bsonType: ["bool","null"] }
          }
        }
      },
      validationLevel: "moderate",
      validationAction: "error"
    });

    await db.collection("activities").createIndex({ ownerIri: 1, boxType: 1, receivedAt: -1 });
    await db.collection("activities").createIndex({ ownerIri: 1, boxType: 1, "activity.published": -1 });
  },

  async down(db, client) {
    await db.collection("activities").drop();
  }
}; 