const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Gifts Endpoints', function () {
  let db;

  const { testUsers, testGifts, testTags } = helpers.makeGiftsFixtures();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());
  before('cleanup', () => helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('GET /api/gifts', () => {
    beforeEach('insert gifts and fill tables', () => {
      return helpers.seedTestGiftsTables(db, testUsers, testGifts, testTags);
    });

    context('INVALID credentials provided', () => {
      it('responds with 401 "missing bearer token" when no JWT token provided', () => {
        return supertest(app)
          .get('/api/gifts')
          .expect(401, { error: { message: 'Missing bearer token' } });
      });

      it('responds 401 unauthorized when bearer token is provided but JWT secret is incorrect', () => {
        const invalidSecret = 'This is not a real JWT secret';
        return supertest(app)
          .get('/api/gifts')
          .set('Authorization', helpers.makeAuthHeader(testUser, invalidSecret))
          .expect(401, { error: { message: 'Unauthorized request' } });
      });

      it('responds with 401 unauthorized when the JWT secret is correct but incorrect user in payload subject', () => {
        const invalidUserSub = {
          user_name: 'not a real username',
          id: 1,
        };

        return supertest(app)
          .get('/api/gifts')
          .set('Authorization', helpers.makeAuthHeader(invalidUserSub))
          .expect(401, { error: { message: 'Unauthorized request' } });
      });
    });

    context.only('VALID credentials provided', () => {
      it('responds with 200 and empty array if user has no gifts yet', () => {
        return supertest(app)
          .get('/api/gifts')
          .set('Authorization', helpers.makeAuthHeader(testUsers[4]))
          .expect(200, []);
      });

      it('responds with 200 and all of the user gifts', () => {
        const expectedGifts = [
          {
            id: 1,
            gift_name: 'test gift 1',
            gift_cost: '32.99',
            gift_description:
              'Long and winding description that definitely needs to be this long man data entry is the pits but this is test description 1',
            gift_url: 'gifturl1.com',
            user_id: 1,
            tag_id: 1,
          },
          {
            id: 2,
            gift_name: 'test gift 2',
            gift_cost: '32.99',
            gift_description:
              'Long and winding description that definitely needs to be this long man data entry is the pits but this is test description 2',
            gift_url: 'gifturl2.com',
            user_id: 1,
            tag_id: 2,
          },
          {
            id: 3,
            gift_name: 'test gift 3',
            gift_cost: '32.99',
            gift_description:
              'Long and winding description that definitely needs to be this long man data entry is the pits but this is test description 3',
            gift_url: 'gifturl3.com',
            user_id: 1,
            tag_id: 2,
          },
          {
            id: 4,
            gift_name: 'test gift 4',
            gift_cost: '32.99',
            gift_description:
              'Long and winding description that definitely needs to be this long man data entry is the pits but this is test description 4',
            gift_url: 'gifturl4.com',
            user_id: 1,
            tag_id: 2,
          },
        ];

        return supertest(app)
          .get('/api/gifts')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, expectedGifts);
      });
    });
  });
});
