const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Gifts Endpoints', function () {
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

    context('VALID credentials provided', () => {
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
            tag_id: 1,
          },
          {
            id: 2,
            gift_name: 'test gift 2',
            gift_cost: '32.99',
            gift_description:
              'Long and winding description that definitely needs to be this long man data entry is the pits but this is test description 2',
            gift_url: 'gifturl2.com',
            tag_id: 2,
          },
          {
            id: 3,
            gift_name: 'test gift 3',
            gift_cost: '32.99',
            gift_description:
              'Long and winding description that definitely needs to be this long man data entry is the pits but this is test description 3',
            gift_url: 'gifturl3.com',
            tag_id: 2,
          },
          {
            id: 4,
            gift_name: 'test gift 4',
            gift_cost: '32.99',
            gift_description:
              'Long and winding description that definitely needs to be this long man data entry is the pits but this is test description 4',
            gift_url: 'gifturl4.com',
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

  describe('POST /api/gifts', () => {
    beforeEach('insert gifts and fill tables', () => {
      return helpers.seedTestGiftsTables(db, testUsers, testGifts, testTags);
    });

    it('responds with 400 and missing gift name if not included in request', () => {
      const badGift = {
        gift_description: 'test description for patch',
        gift_url: 'patchtest.com',
        user_id: 1,
      };
      return supertest(app)
        .post('/api/gifts')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(badGift)
        .expect(400, { error: { message: 'Gift name is required' } });
    });

    it('responds with a 201 and the created gift', () => {
      const newGift = {
        gift_name: 'test patch gift',
        gift_description: 'test description for patch',
        gift_url: 'patchtest.com',
        user_id: 1,
      };

      return supertest(app)
        .post('/api/gifts')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(newGift)
        .expect(201)
        .expect((response) => {
          expect(response.body).to.be.an('object');
          expect(response.body).to.have.property('id');
          expect(response.body.gift_url).to.eql(newGift.gift_url);
          expect(response.body.gift_name).to.eql(newGift.gift_name);
          expect(response.body.gift_description).to.eql(
            newGift.gift_description
          );
          expect(response.body.gift_cost).to.equal(null);
          expect(response.headers.location).to.equal(
            `/api/gifts/${response.body.id}`
          );
        });
    });
  });

  describe('DELETE /api/gifts/:giftId', () => {
    beforeEach('insert gifts and fill tables', () => {
      return helpers.seedTestGiftsTables(db, testUsers, testGifts, testTags);
    });

    context(
      'Given that there are no gifts in db or gift id does not exist',
      () => {
        it('responds with a 404 not found ', () => {
          const giftId = 123456;
          return supertest(app)
            .delete(`/api/gifts/${giftId}`)
            .set('Authorization', helpers.makeAuthHeader(testUser))
            .expect(404, { error: { message: 'Gift does not exist' } });
        });
      }
    );
    context('Given that the gift does exist', () => {
      it('responds with 204 and deletes the gift ', () => {
        const giftId = 1;
        return supertest(app)
          .delete(`/api/gifts/${giftId}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(204)
          .then(() => {
            return supertest(app)
              .get(`/api/gifts/${giftId}`)
              .set('Authorization', helpers.makeAuthHeader(testUser))
              .expect(404, { error: { message: 'Gift does not exist' } });
          });
      });
    });
  });

  describe('GET /api/gifts/:giftId', () => {
    beforeEach('insert gifts and fill tables', () => {
      return helpers.seedTestGiftsTables(db, testUsers, testGifts, testTags);
    });
    context(
      'Given that there are no gifts in db or gift id does not exist',
      () => {
        it('responds with a 404 not found ', () => {
          const giftId = 123456;
          return supertest(app)
            .get(`/api/gifts/${giftId}`)
            .set('Authorization', helpers.makeAuthHeader(testUser))
            .expect(404, { error: { message: 'Gift does not exist' } });
        });
      }
    );

    context('given that the gift exists in the db', () => {
      it('respond with 200 and the expected gift', () => {
        const expectedGift = {
          id: 1,
          gift_name: 'test gift 1',
          gift_cost: '32.99',
          gift_description:
            'Long and winding description that definitely needs to be this long man data entry is the pits but this is test description 1',
          gift_url: 'gifturl1.com',
          tag_id: 1,
        };

        return supertest(app)
          .get('/api/gifts/1')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, expectedGift);
      });
    });
  });

  describe('PATCH /api/gifts/:giftId', () => {
    beforeEach('insert gifts and fill tables', () => {
      return helpers.seedTestGiftsTables(db, testUsers, testGifts, testTags);
    });
    context(
      'Given that there are no gifts in db or gift id does not exist',
      () => {
        it('responds with a 404 not found ', () => {
          const giftId = 123456;
          return supertest(app)
            .patch(`/api/gifts/${giftId}`)
            .set('Authorization', helpers.makeAuthHeader(testUser))
            .expect(404, { error: { message: 'Gift does not exist' } });
        });
      }
    );

    context('given that the gift exists in the db', () => {
      it('respond with 204 and the expected gift', () => {
        const expectedGift = {
          id: 1,
          gift_name: 'test gift 1',
          gift_cost: '32.99',
          gift_description: 'This should be a PATCHED description',
          gift_url: 'gifturl1.com',
          tag_id: 1,
        };

        return supertest(app)
          .patch('/api/gifts/1')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(expectedGift)
          .expect(204)
          .then(() => {
            return supertest(app)
              .get(`/api/gifts/${expectedGift.id}`)
              .set('Authorization', helpers.makeAuthHeader(testUser))
              .expect(200, expectedGift);
          });
      });

      it.only('responds with gift with no tag if null provided for tag id', () => {
        const expectedGift = {
          id: 1,
          gift_name: 'test gift 1',
          gift_cost: '32.99',
          gift_description: 'This should be a PATCHED description',
          gift_url: 'gifturl1.com',
          tag_id: null,
        };

        return supertest(app)
          .patch('/api/gifts/1')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(expectedGift)
          .expect(204)
          .then(() => {
            return supertest(app)
              .get(`/api/gifts/${expectedGift.id}`)
              .set('Authorization', helpers.makeAuthHeader(testUser))
              .expect(200, expectedGift);
          });
      });
    });
  });
});
