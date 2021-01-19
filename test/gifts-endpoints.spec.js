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
      helpers.seedTestGiftsTables(db, testUsers, testGifts, testTags);
    });

    context('Bad credentials provided', () => {
      it('responds with 400 "missing bearer token" when no JWT token provided', () => {
        return supertest(app)
          .get('/api/gifts')
          .expect(401, { error: { message: 'Missing bearer token' } });
      });

      //TODO continue adding jwt-auth tests for gifts endpoint
    });
  });
});
