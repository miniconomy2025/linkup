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
        bsonType: 'string', // stored as string per your Mongoose schema
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

    // Notes collection
    const noteValidator = {
      $jsonSchema: {
        bsonType: 'object',
        required: ['id', 'type', 'attributedTo', 'published', 'content'],
        properties: {
          ...baseObjectFields,
          type: {
            enum: ['Note'],
            description: 'Must be "Note"'
          },
          content: {
            bsonType: 'string',
            description: 'Textual content of the note'
          }
        },
        additionalProperties: false
      }
    };

    await db.createCollection('notes', {
      validator: noteValidator,
      validationLevel: 'strict',
      validationAction: 'error'
    });

    await db.collection('notes').createIndex({ id: 1 }, { unique: true });
    await db.collection('notes').createIndex({ published: -1 });

    // Images collection
    const imageValidator = {
      $jsonSchema: {
        bsonType: 'object',
        required: ['id', 'type', 'attributedTo', 'published', 'url'],
        properties: {
          ...baseObjectFields,
          type: {
            enum: ['Image'],
            description: 'Must be "Image"'
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
      }
    };

    await db.createCollection('images', {
      validator: imageValidator,
      validationLevel: 'strict',
      validationAction: 'error'
    });

    await db.collection('images').createIndex({ id: 1 }, { unique: true });
    await db.collection('images').createIndex({ published: -1 });
  },

  async down(db, client) {
    await db.collection('notes').drop();
    await db.collection('images').drop();
  }
};
