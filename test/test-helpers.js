const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeTestUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      password: 'password1',
      first_name: 'Test 1 first',
      last_name: 'Test 1 last',
      email: 'email1@gmail.com',
      date_created: '2023-01-18T16:28:32.615Z',
    },
    {
      id: 2,
      user_name: 'test-user-2',
      password: 'password2',
      first_name: 'Test 2 first',
      last_name: 'Test 2 last',
      email: 'email2@gmail.com',
      date_created: '2023-01-18T16:28:32.615Z',
    },
    {
      id: 3,
      user_name: 'test-user-3',
      password: 'password3',
      first_name: 'Test 3 first',
      last_name: 'Test 3 last',
      email: 'email3@gmail.com',
      date_created: '2023-01-18T16:28:32.615Z',
    },
    {
      id: 4,
      user_name: 'test-user-4',
      password: 'password4',
      first_name: 'Test 4 first',
      last_name: 'Test 4 last',
      email: 'email4@gmail.com',
      date_created: '2023-01-18T16:28:32.615Z',
    },
    {
      id: 5,
      user_name: 'test-user-5',
      password: 'password5',
      first_name: 'Test 5 first',
      last_name: 'Test 5 last',
      email: 'email5@gmail.com',
      date_created: '2023-01-18T16:28:32.615Z',
    },
  ];
}

function makeTestTagsArray() {
  return [
    {
      id: 1,
      tag_name: 'test tag 1',
      date_created: '2021-01-18T16:28:32.615Z',
    },
    {
      id: 2,
      tag_name: 'test tag 2',
      date_created: '2021-01-18T16:28:32.615Z',
    },
    {
      id: 3,
      tag_name: 'test tag 3',
      date_created: '2021-01-18T16:28:32.615Z',
    },
    {
      id: 4,
      tag_name: 'test tag 4',
      date_created: '2021-01-18T16:28:32.615Z',
    },
    {
      id: 5,
      tag_name: 'test tag 5',
      date_created: '2021-01-18T16:28:32.615Z',
    },
    {
      id: 6,
      tag_name: 'test tag 6',
      date_created: '2021-01-18T16:28:32.615Z',
    },
  ];
}

function makeTestGiftsArray() {
  return [
    {
      id: 1,
      gift_name: 'test gift 1',
      gift_cost: 32.99,
      gift_description:
        'Long and winding description that definitely needs to be this long man data entry is the pits but this is test description 1',
      gift_url: 'gifturl1.com',
      user_id: 1,
      tag_id: 1,
    },
    {
      id: 2,
      gift_name: 'test gift 2',
      gift_cost: 32.99,
      gift_description:
        'Long and winding description that definitely needs to be this long man data entry is the pits but this is test description 2',
      gift_url: 'gifturl2.com',
      user_id: 1,
      tag_id: 2,
    },
    {
      id: 3,
      gift_name: 'test gift 3',
      gift_cost: 32.99,
      gift_description:
        'Long and winding description that definitely needs to be this long man data entry is the pits but this is test description 3',
      gift_url: 'gifturl3.com',
      user_id: 1,
      tag_id: 2,
    },
    {
      id: 4,
      gift_name: 'test gift 4',
      gift_cost: 32.99,
      gift_description:
        'Long and winding description that definitely needs to be this long man data entry is the pits but this is test description 4',
      gift_url: 'gifturl4.com',
      user_id: 1,
      tag_id: 2,
    },
    {
      id: 5,
      gift_name: 'test gift 5',
      gift_cost: 32.99,
      gift_description:
        'Long and winding description that definitely needs to be this long man data entry is the pits but this is test description 5',
      gift_url: 'gifturl5.com',
      user_id: 2,
      tag_id: 3,
    },
    {
      id: 6,
      gift_name: 'test gift 6',
      gift_cost: 32.99,
      gift_description:
        'Long and winding description that definitely needs to be this long man data entry is the pits but this is test description 6',
      gift_url: 'gifturl6.com',
      user_id: 2,
      tag_id: 3,
    },
    {
      id: 7,
      gift_name: 'test gift 7',
      gift_cost: 32.99,
      gift_description:
        'Long and winding description that definitely needs to be this long man data entry is the pits but this is test description 7',
      gift_url: 'gifturl7.com',
      user_id: 2,
      tag_id: 4,
    },
    {
      id: 8,
      gift_name: 'test gift 8',
      gift_cost: 32.99,
      gift_description:
        'Long and winding description that definitely needs to be this long man data entry is the pits but this is test description 8',
      gift_url: 'gifturl1.com',
      user_id: 3,
      tag_id: 5,
    },
    {
      id: 9,
      gift_name: 'test gift 9',
      gift_cost: 32.99,
      gift_description:
        'Long and winding description that definitely needs to be this long man data entry is the pits but this is test description 9',
      gift_url: 'gifturl9.com',
      user_id: 3,
      tag_id: 5,
    },
    {
      id: 10,
      gift_name: 'test gift 10',
      gift_cost: 32.99,
      gift_description:
        'Long and winding description that definitely needs to be this long man data entry is the pits but this is test description 10',
      gift_url: 'gifturl10.com',
      user_id: 4,
      tag_id: 6,
    },
    {
      id: 11,
      gift_name: 'test gift 11',
      gift_cost: 32.99,
      gift_description:
        'Long and winding description that definitely needs to be this long man data entry is the pits but this is test description 11',
      gift_url: 'gifturl11.com',
      user_id: 4,
      tag_id: 6,
    },
  ];
}

// clean tables of db
function cleanTables(db) {
  return db.raw(
    'TRUNCATE gift_closet_gifts, gift_closet_tags, gift_closet_users RESTART IDENTITY CASCADE'
  );
}

function makeGiftsFixtures() {
  const testUsers = makeTestUsersArray();
  const testGifts = makeTestGiftsArray();
  const testTags = makeTestTagsArray();
  return { testUsers, testGifts, testTags };
}

// function to seed test users into db with encrypted passwords
function seedTestUsers(db, users) {
  //map over each user, spread out the rest of the user object but replace password w/ bcrypt version
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));

  //insert prepped users into db, will then need to manually set sequence table to start after the id of the last user in table to prevent errors
  return db
    .into('gift_closet_users')
    .insert(preppedUsers)
    .then(() => {
      return db.raw(
        `SELECT setval('gift_closet_users_id_seq', ?)`,
        users[users.length - 1].id
      );
    });
}

//seed all tables for tests

function seedTestGiftsTables(db, users, gifts, tags = []) {
  return seedTestUsers(db, users)
    .then(() => {
      return db.into('gift_closet_tags').insert(tags);
    })
    .then(() => {
      return db.into('gift_closet_gifts').insert(gifts);
    })
    .then(() => {
      return db.raw(
        `SELECT setval('gift_closet_gifts_id_seq', ?)`,
        gifts[gifts.length - 1].id
      );
    })
    .then(() => {
      return db.raw(
        `SELECT setval('gift_closet_tags_id_seq', ?)`,
        tags[tags.length - 1].id
      );
    });
}

//make jwt authorization header

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  });

  return `Bearer ${token}`;
}

module.exports = {
  makeTestUsersArray,
  makeAuthHeader,
  makeTestGiftsArray,
  makeTestTagsArray,
  seedTestUsers,
  seedTestGiftsTables,
  cleanTables,
  makeGiftsFixtures,
};
