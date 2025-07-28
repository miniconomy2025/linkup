module.exports = {
  async up(db, client) {
    await db.createCollection("users", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["iri", "inbox", "outbox", "isLocal"],
          properties: {
            iri: { bsonType: "string" },
            preferredUsername: { bsonType: ["string","null"] },
            displayName: { bsonType: ["string","null"] },
            inbox: { bsonType: "string" },
            outbox: { bsonType: "string" },
            followers: { bsonType: ["string","null"] },
            following: { bsonType: ["string","null"] },
            publicKey: {
              bsonType: "object",
              required: ["id", "owner", "publicKeyPem"],
              properties: {
                id: { bsonType: "string" },
                owner: { bsonType: "string" },
                publicKeyPem: { bsonType: "string" }
              }
            },
            privateKeyPem: { bsonType: ["string","null"] },
            isLocal: { bsonType: "bool" },
            createdAt: { bsonType: ["date","null"] },
            updatedAt: { bsonType: ["date","null"] }
          }
        }
      },
      validationLevel: "moderate",
      validationAction: "error"
    });

    await db.collection("users").createIndex({ iri: 1 }, { unique: true });
  },

  async down(db, client) {
    await db.collection("users").drop();
  }
}; 