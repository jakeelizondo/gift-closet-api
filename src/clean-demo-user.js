const knex = require('knex');
const { DATABASE_URL } = require('./config');

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
});

console.log('cleaning demo user');

db.raw('DELETE FROM gift_closet_gifts WHERE user_id = 1').then((data) => {
  console.log('deleted', data.rowCount);
  db.raw(
    `INSERT INTO gift_closet_gifts (user_id, tag_id, gift_name, gift_cost, gift_description, gift_url)
  VALUES
      (1, 3, 'Box of romantic chocolates', NULL, 'Romantic box of chocolates that my demo wife will love', NULL),
      (1, 1, 'Workout equipment', 32.99, 'This will be a good generic gift to use for my demo friends gift exchange', NULL),
      (1, 6, 'Hand warmers', 10, 'These will be good for my demo wife because her hands always get cold', 'https://amazon.com/definitely-real-url')`
  )
    .then((data) => {
      console.log('inserted', data.rowCount);
    })
    .then(() => {
      db.destroy();
    });
});
