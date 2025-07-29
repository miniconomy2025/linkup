module.exports = {
  async up(db, client) {
    // JSON‐Schema for InboxItem documents
    const inboxValidator = {
      $jsonSchema: {
        bsonType: 'object',
        required: ['actor', 'activity', 'receivedAt'],
        properties: {
          actor: {
            bsonType: 'string',
            description: 'must be a string and is required (actor URI)'
          },
          activity: {
            bsonType: 'string',
            description: 'must be a string and is required (activity URI)'
          },
          receivedAt: {
            bsonType: 'date',
            description: 'must be a date and is required'
          }
        }
      }
    };

    // Create collection with validation
    await db.createCollection('inboxitems', {
      validator: inboxValidator,
      validationLevel: 'strict',
      validationAction: 'error'
    });

    // Indexes
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