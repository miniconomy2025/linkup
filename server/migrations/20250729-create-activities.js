module.exports = {
  async up(db, client) {
    // Create Activity
    const createValidator = {
      $jsonSchema: {
        bsonType: 'object',
        required: ['id', 'type', 'actor', 'object'],
        properties: {
          id: { bsonType: 'string' },
          type: { enum: ['Create'] },
          actor: { bsonType: 'string' },
          published: { bsonType: 'date' },
          to: {
            bsonType: ['array'],
            items: { bsonType: 'string' }
          },
          object: { bsonType: 'object' }
        },
        additionalProperties: false
      }
    };
    await db.createCollection('creates', {
      validator: createValidator,
      validationLevel: 'strict',
      validationAction: 'error'
    });

    // Follow Activity
    const followValidator = {
      $jsonSchema: {
        bsonType: 'object',
        required: ['id', 'type', 'actor', 'object'],
        properties: {
          id: { bsonType: 'string' },
          type: { enum: ['Follow'] },
          actor: { bsonType: 'string' },
          published: { bsonType: 'date' },
          to: {
            bsonType: ['array'],
            items: { bsonType: 'string' }
          },
          object: { bsonType: 'string' }
        },
        additionalProperties: false
      }
    };
    await db.createCollection('follows', {
      validator: followValidator,
      validationLevel: 'strict',
      validationAction: 'error'
    });

    // Like Activity
    const likeValidator = {
      $jsonSchema: {
        bsonType: 'object',
        required: ['id', 'type', 'actor', 'object'],
        properties: {
          id: { bsonType: 'string' },
          type: { enum: ['Like'] },
          actor: { bsonType: 'string' },
          published: { bsonType: 'date' },
          to: {
            bsonType: ['array'],
            items: { bsonType: 'string' }
          },
          object: { bsonType: 'string' }
        },
        additionalProperties: false
      }
    };
    await db.createCollection('likes', {
      validator: likeValidator,
      validationLevel: 'strict',
      validationAction: 'error'
    });

    // Undo Activity
    const undoValidator = {
      $jsonSchema: {
        bsonType: 'object',
        required: ['id', 'type', 'actor', 'object'],
        properties: {
          id: { bsonType: 'string' },
          type: { enum: ['Undo'] },
          actor: { bsonType: 'string' },
          published: { bsonType: 'date' },
          to: {
            bsonType: ['array'],
            items: { bsonType: 'string' }
          },
          object: { bsonType: 'string', description: 'ID of the Follow activity being undone' }
        },
        additionalProperties: false
      }
    };
    await db.createCollection('undos', {
      validator: undoValidator,
      validationLevel: 'strict',
      validationAction: 'error'
    });

    // Indexes for all activities
    for (const col of ['creates', 'follows', 'likes', 'undos']) {
      await db.collection(col).createIndex({ id: 1 }, { unique: true });
      await db.collection(col).createIndex({ actor: 1 });
      await db.collection(col).createIndex({ published: -1 });
    }
  },

  async down(db, client) {
    for (const col of ['creates', 'follows', 'likes', 'undos']) {
      await db.collection(col).drop();
    }
  }
}; 