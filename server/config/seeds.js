const db = require('./connection');
const { User } = require('../models'); // add Thought for thought seeds
const cleanDB = require('./cleanDB');

db.once('open', async () => {
  try {
    await cleanDB('User', 'users');

    // Create users
    await User.create([
      {
        username: 'Xandromus',
        email: 'xandro@aol.com',
        password: '12345',
/* -----------------minesweeper score*/ 
        mineScore: [
          {
            minePoints: 100,
            mineTimeTaken: 10
          }
        ]
      },

      {
        username: 'Sal',
        email: 'sal@hotmail.com',
        password: '12345',
        mineScore: [
          {
            minePoints: 90,
            mineTimeTaken: 12
          }
        ]
      },

      {
        username: 'Lernantino',
        email: 'lernantino@gmail.com',
        password: '12345',
        mineScore: [
          {
            minePoints: 50,
            mineTimeTaken: 100
          }
        ]
      },

      {
        username: 'Amiko',
        email: 'amiko2k20@aol.com',
        password: '12345'
      },
      {
        username: 'David',
        email: 'dthomas@techfriends.dev',
        password: '12345'
      }
    ]);

    console.log('🔑 users seeded');
    console.log('💣 user.minesweeper scores seeded');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});