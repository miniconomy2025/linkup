module.exports = {
  async up(db, client) {
    // Note documents
    const noteValidator = {
      $jsonSchema: {
        bsonType: 'object',
        required: ['id', 'type', 'attributedTo', 'published', 'content'],
        properties: {
          id: {
            bsonType: 'string',
            description: 'Object URI (string) is required and must be unique'
          },
          type: {
            enum: ['Note'],
            description: 'Must be "Note"'
          },
          attributedTo: {
            bsonType: 'string',
            description: 'Actor URI who created this note'
          },
          published: {
            bsonType: 'date',
            description: 'ISO date when the note was published'
          },
          to: {
            bsonType: ['array'],
            items: { bsonType: 'string' },
            description: 'Array of recipient URIs'
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

    // Image documents
    const imageValidator = {
      $jsonSchema: {
        bsonType: 'object',
        required: ['id', 'type', 'attributedTo', 'published', 'url'],
        properties: {
          id: {
            bsonType: 'string',
            description: 'Object URI (string) is required and unique'
          },
          type: {
            enum: ['Image'],
            description: 'Must be "Image"'
          },
          attributedTo: {
            bsonType: 'string',
            description: 'Actor URI who posted the image'
          },
          published: {
            bsonType: 'date',
            description: 'ISO date when the image was published'
          },
          to: {
            bsonType: ['array'],
            items: { bsonType: 'string' },
            description: 'Array of recipient URIs'
          },
          url: {
            bsonType: 'string',
            description: 'URL pointing to the image file'
          },
          name: { bsonType: 'string' },
          mediaType: { bsonType: 'string' },
          width: { bsonType: 'int' },
          height: { bsonType: 'int' }
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