module.exports = {
  async up(db, client) {
    const outboxValidator = {
      $jsonSchema: {
        bsonType: 'object',
        required: ['actor', 'activity', 'createdAt'],
        properties: {
          _id: {
            bsonType: 'objectId',
            description: 'MongoDB document ID'
          },
          actor: {
            bsonType: 'string',
            description: 'Actor URI as a string; required'
          },
          activity: {
            bsonType: 'string',
            description: 'Activity URI as a string; required and must be unique'
          },
          createdAt: {
            bsonType: 'date',
            description: 'Date when the outbox item was created; required'
          },
          updatedAt: {
            bsonType: ['date', 'null'],
            description: 'Optional date when the outbox item was last updated'
          }
        },
        additionalProperties: false
      }
    };

    await db.createCollection('outboxitems', {
      validator: outboxValidator,
      validationLevel: 'strict',
      validationAction: 'error'
    });

    await db.collection('outboxitems').createIndex(
      { activity: 1 },
      { unique: true }
    );

    await db.collection('outboxitems').createIndex(
      { actor: 1, createdAt: -1 }
    );
  },

  async down(db, client) {
    await db.collection('outboxitems').drop();
  }
};
