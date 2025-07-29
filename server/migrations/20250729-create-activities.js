module.exports = {
  async up(db, client) {
    // Shared schema properties
    const commonActivityFields = {
      _id: {
        bsonType: 'objectId',
        description: 'MongoDB document ID',
      },
      id: { 
        bsonType: 'string', 
        description: 'ActivityPub ID (URI)' 
      },
      type: { 
        enum: ['Create', 'Follow', 'Like', 'Undo'], 
        description: 'Activity type' 
      },
      actor: { 
        bsonType: 'string', 
        description: 'Actor ID (URI)' 
      },
      published: { 
        bsonType: 'date', 
        description: 'Published date (ISO)' 
      },
      to: {
        bsonType: 'array',
        items: { bsonType: 'string' },
        description: 'Recipients (URIs)',
      },
      createdAt: {
        bsonType: ['date', 'null'],
        description: 'Document creation timestamp',
      },
      updatedAt: {
        bsonType: ['date', 'null'],
        description: 'Document update timestamp',
      }
    };

    // Create Activity
    const createValidator = {
      $jsonSchema: {
        bsonType: 'object',
        required: ['id', 'type', 'actor', 'object'],
        properties: {
          ...commonActivityFields,
          type: { enum: ['Create'] },
          object: {
            bsonType: 'object',
            description: 'Embedded object being created'
          }
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
          ...commonActivityFields,
          type: { enum: ['Follow'] },
          object: {
            bsonType: 'string',
            description: 'URI of the actor being followed'
          }
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
          ...commonActivityFields,
          type: { enum: ['Like'] },
          object: {
            bsonType: 'string',
            description: 'URI of the object being liked'
          }
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
          ...commonActivityFields,
          type: { enum: ['Undo'] },
          object: {
            bsonType: 'object',
            description: 'Follow activity being undone (embedded)'
          }
        },
        additionalProperties: false
      }
    };
    await db.createCollection('undos', {
      validator: undoValidator,
      validationLevel: 'strict',
      validationAction: 'error'
    });

    // Indexes for each activity collection
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
