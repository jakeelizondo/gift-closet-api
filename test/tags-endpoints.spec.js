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
          {
            id: 4,
            tag_name: 'test tag 4',
          },
        ];

        return supertest(app)
          .get('/api/tags')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, expectedTags);
      });
    });
  });

  describe('POST /api/tags', () => {
    beforeEach('insert tags and fill tables', () => {
      return helpers.seedTestGiftsTables(db, testUsers, testGifts, testTags);
    });
    it('responds with 400 and "Missing required fields" if missing tag_name', () => {
      const badTag = {};
      return supertest(app)
        .post('/api/tags')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(badTag)
        .expect(400, { error: { message: 'Missing required field tag_name' } });
    });

    it('responds with 201 and  new tag if successful', () => {
      const newTag = {
        tag_name: 'test-tag',
        user_id: testUser.id,
      };

      return supertest(app)
        .post('/api/tags')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(newTag)
        .expect(201)
        .then((response) => {
          expect(response.body).to.have.property('id');
          expect(response.body);
          expect(response.headers.location).to.equal(
            `/api/tags/${response.body.id}`
          );
          expect(response.body.tag_name).to.equal(newTag.tag_name);
        });
    });
  });

  describe('GET /api/tags/:tag_id', () => {
    beforeEach('insert tags and fill tables', () => {
      return helpers.seedTestGiftsTables(db, testUsers, testGifts, testTags);
    });
    context('given that the tag does NOT exist in the database', () => {
      it('responds with 404 and "this tag does not exist" message', () => {
        const fakeTag = 123456;
        return supertest(app)
          .get(`/api/tags/${fakeTag}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(404, { error: { message: 'Requested tag does not exist' } });
      });
    });

    context('given that the tag DOES exists in the database', () => {
      it('responds with 200 and the requested tag', () => {
        const expectedTag = {
          id: 1,
          tag_name: 'test tag 1',
        };

        return supertest(app)
          .get('/api/tags/1')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, expectedTag);
      });
    });
  });

  describe('DELETE /api/tags/:tag_id', () => {
    beforeEach('insert tags and fill tables', () => {
      return helpers.seedTestGiftsTables(db, testUsers, testGifts, testTags);
    });
    context('given that the tag does not exist for that user in the db', () => {
      it('responds with a 404 not found', () => {
        const badTag = 1234567;
        return supertest(app)
          .delete(`/api/tags/${badTag}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(404, { error: { message: 'Requested tag does not exist' } });
      });
    });

    context('given that the tag DOES exist', () => {
      it('responds with 204 and deletes the tag', () => {
        return supertest(app)
          .delete(`/api/tags/${1}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(204)
          .then(() => {
            return supertest(app)
              .get(`/api/tags/${1}`)
              .set('Authorization', helpers.makeAuthHeader(testUser))
              .expect(404);
          });
      });
    });
  });

  describe('PATCH /api/tags/:tag_id', () => {
    beforeEach('insert tags and fill tables', () => {
      return helpers.seedTestGiftsTables(db, testUsers, testGifts, testTags);
    });
    context('given that the tag DOES NOT exist in db', () => {
      it('should respond with a 404 not found', () => {
        const badTag = 12345678;
        return supertest(app)
          .patch(`/api/tags/${badTag}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(404, { error: { message: 'Requested tag does not exist' } });
      });
    });

    context('given that the tag DOES exist in db', () => {
      it('responds with 204 and updates the tag', () => {
        const updateTag = {
          tag_name: 'TEST PATCH',
        };
        const expectedTag = {
          id: 1,
          tag_name: 'TEST PATCH',
        };

        return supertest(app)
          .patch('/api/tags/1')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(updateTag)
          .expect(204)
          .then(() => {
            return supertest(app)
              .get('/api/tags/1')
              .set('Authorization', helpers.makeAuthHeader(testUser))
              .expect(200, expectedTag);
          });
      });
    });
  });
});
