var rug = require('random-username-generator');
 
rug.setNames(['heart', 'spade', 'diamond', 'clover']);
// rug.setAdjectives(['neat']);
rug.setSeperator('_');

module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    rug.generate()
    let users = [];
    for(let i = 0; i < 100; i++) {
      users.push({
        username: rug.generate(),
        points: 0
      })
    }
    await db.collection('users').insertMany(users);
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    await db.collection('users').deleteMany({});
  }
};
