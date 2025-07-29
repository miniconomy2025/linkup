module.exports = {
  async up(db, client) {
    // JSON‐Schema for OutboxItem documents
    const outboxValidator = {
      $jsonSchema: {
        bsonType: 'object',
        required: ['actor', 'activity', 'createdAt'],
        properties: {
          actor: {
            bsonType: 'string',
            description: 'must be a string and is required (actor URI)'
          },
          activity: {
            bsonType: 'string',
            description: 'must be a string and is required (activity URI)'
          },
          createdAt: {
            bsonType: 'date',
            description: 'must be a date and is required'
          }
        }
      }
    };

    // Create collection with validation
    await db.createCollection('outboxitems', {
      validator: outboxValidator,
      validationLevel: 'strict',
      validationAction: 'error'
    });

    // Indexes
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