module.exports = {
  async up(db, client) {
    const inboxValidator = {
      $jsonSchema: {
        bsonType: 'object',
        required: ['actor', 'activity', 'receivedAt'],
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
          receivedAt: {
            bsonType: 'date',
            description: 'Date when the inbox item was received; required'
          },
          createdAt: {
            bsonType: ['date', 'null'],
            description: 'Optional creation timestamp'
          },
          updatedAt: {
            bsonType: ['date', 'null'],
            description: 'Optional update timestamp'
          }
        },
        additionalProperties: false
      }
    };

    await db.createCollection('inboxitems', {
      validator: inboxValidator,
      validationLevel: 'strict',
      validationAction: 'error'
    });

    await db.collection('inboxitems').createIndex(
      { activity: 1 },
      { unique: true }
    );

    await db.collection('inboxitems').createIndex(
      { actor: 1, receivedAt: -1 }
    );
  },

  async down(db, client) {
    await db.collection('inboxitems').drop();
  }
};
