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
            description: 'Unique username'
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
            required: ['id', 'type', 'attributedTo', 'published', 'url'],
            properties: {
              id: {
                bsonType: 'string',
                description: 'Object URI (string) is required and must be unique'
              },
              type: {
                enum: ['Image'],
                description: 'Must be "Image"'
              },
              attributedTo: {
                bsonType: 'string',
                description: 'Actor URI who created the object'
              },
              published: {
                bsonType: 'string',
                description: 'ISO date string when the object was published'
              },
              to: {
                bsonType: ['array'],
                items: {
                  bsonType: 'string'
                },
                description: 'Array of recipient URIs'
              },
              createdAt: {
                bsonType: ['date', 'null'],
                description: 'Optional creation timestamp'
              },
              updatedAt: {
                bsonType: ['date', 'null'],
                description: 'Optional update timestamp'
              },
              url: {
                bsonType: 'string',
                description: 'URL pointing to the image file'
              },
              name: {
                bsonType: 'string',
                description: 'Optional display name or caption'
              }
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
          },
          googleId: {
            bsonType: 'string',
            description: 'Google sub'
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
