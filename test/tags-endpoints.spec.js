const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Tags Endpoints', function () {
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

  describe('GET /api/tags', () => {
    beforeEach('insert tags and fill tables', () => {
      return helpers.seedTestGiftsTables(db, testUsers, testGifts, testTags);
    });

    context('VALID credentials provided', () => {
      it('responds with 200 and empty array if user has no tags yet', () => {
        return supertest(app)
          .get('/api/tags')
          .set('Authorization', helpers.makeAuthHeader(testUsers[4]))
          .expect(200, []);
      });

      it('responds with 200 and a list of tags if user has tags in db', () => {
        const expectedTags = [
          {
            id: 1,
            tag_name: 'test tag 1',
          },
          {
            id: 2,
            tag_name: 'test tag 2',
          },
        ];

        return supertest(app)
          .get('/api/tags')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, expectedTags);
      });
    });
  });
});
