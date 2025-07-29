module.exports = {
  async up(db, client) {
    const actorValidator = {
      $jsonSchema: {
        bsonType: 'object',
        required: ['id', 'type', 'preferredUsername', 'inbox', 'outbox', 'followers'],
        properties: {
          id: {
            bsonType: 'string',
            description: 'Actor URI (string) is required and must be unique'
          },
          type: {
            enum: ['Person', 'Group'],
            description: 'Must be either "Person" or "Group"'
          },
          preferredUsername: {
            bsonType: 'string',
            description: 'Username chosen by the actor'
          },
          inbox: {
            bsonType: 'string',
            description: 'Inbox URI for the actor'
          },
          outbox: {
            bsonType: 'string',
            description: 'Outbox URI for the actor'
          },
          followers: {
            bsonType: 'string',
            description: 'Followers collection URI'
          },
          publicKey: {
            bsonType: ['object'],
            description: 'Optional public key object',
            properties: {
              id: { bsonType: 'string' },
              owner: { bsonType: 'string' },
              publicKeyPem: { bsonType: 'string' }
            },
            additionalProperties: false
          }
        },
        additionalProperties: false
      }
    };

    await db.createCollection('actors', {
      validator: actorValidator,
      validationLevel: 'strict',
      validationAction: 'error'
    });

    await db.collection('actors').createIndex({ id: 1 }, { unique: true });
    await db.collection('actors').createIndex({ preferredUsername: 1 });
  },

  async down(db, client) {
    await db.collection('actors').drop();
  }
}; 