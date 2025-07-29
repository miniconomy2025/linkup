module.exports = {
  async up(db, client) {
    const actorValidator = {
      $jsonSchema: {
        bsonType: 'object',
        required: ['id', 'type', 'preferredUsername', 'inbox', 'outbox', 'followers', 'following'],
        properties: {
          _id: {
            bsonType: 'objectId',
            description: 'MongoDB unique identifier'
          },
          id: {
            bsonType: 'string',
            description: 'Actor URI (string), required and must be unique'
          },
          type: {
            enum: ['Person', 'Group'],
            description: 'Type of actor, must be either "Person" or "Group"'
          },
          preferredUsername: {
            bsonType: 'string',
            description: 'Google sub'
          },
          name: {
            bsonType: 'string',
            description: 'Name from Google account'
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
          following: {
            bsonType: 'string',
            description: 'Following collection URI'
          },
          icon: {
            bsonType: 'object',
            required: false,
            properties: {
              id: { bsonType: 'string', description: 'URI of the image object' },
              type: { enum: ['Image'], description: 'Must be "Image"' },
              attributedTo: { bsonType: 'string', description: 'Actor ID' },
              published: { bsonType: 'string', description: 'ISO date string' },
              to: {
                bsonType: ['array'],
                items: { bsonType: 'string' },
                description: 'Array of recipient URIs'
              },
              url: { bsonType: 'string', description: 'URL pointing to the image file' },
              name: { bsonType: 'string', description: 'Optional caption or alt text' }
            },
            additionalProperties: false
          },
          createdAt: {
            bsonType: 'date',
            description: 'Document creation timestamp'
          },
          updatedAt: {
            bsonType: 'date',
            description: 'Document update timestamp'
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
