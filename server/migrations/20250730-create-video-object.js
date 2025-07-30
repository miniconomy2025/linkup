module.exports = {
  async up(db, client) {
    const baseObjectFields = {
      _id: {
        bsonType: 'objectId',
        description: 'MongoDB document ID'
      },
      id: {
        bsonType: 'string',
        description: 'Object URI (string) is required and must be unique'
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
        items: { bsonType: 'string' },
        description: 'Array of recipient URIs'
      },
      createdAt: {
        bsonType: ['date', 'null'],
        description: 'Optional creation timestamp'
      },
      updatedAt: {
        bsonType: ['date', 'null'],
        description: 'Optional update timestamp'
      }
    };

    // Videos collection
    const videoValidator = {
      $jsonSchema: {
        bsonType: 'object',
        required: ['id', 'type', 'attributedTo', 'published', 'url'],
        properties: {
          ...baseObjectFields,
          type: {
            enum: ['Video'],
            description: 'Must be "Video"'
          },
          url: {
            bsonType: 'string',
            description: 'URL pointing to the video file'
          },
          name: {
            bsonType: 'string',
            description: 'Optional display name or caption'
          }
        },
        additionalProperties: false
      }
    };

    await db.createCollection('videos', {
      validator: videoValidator,
      validationLevel: 'strict',
      validationAction: 'error'
    });

    await db.collection('videos').createIndex({ id: 1 }, { unique: true });
    await db.collection('videos').createIndex({ published: -1 });
  },

  async down(db, client) {
    await db.collection('videos').drop();
  }
};
