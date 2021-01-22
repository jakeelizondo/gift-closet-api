const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');
const bcrypt = require('bcryptjs');

describe.only('Auth Endpoints', function () {
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

  describe('POST /api/users', () => {
    context('User Validation', () => {
      beforeEach('insert tags and fill tables', () => {
        return helpers.seedTestGiftsTables(db, testUsers, testGifts, testTags);
      });
      const requiredFields = [
        'first_name',
        'last_name',
        'email',
        'user_name',
        'password',
      ];

      requiredFields.forEach((field) => {
        const registerAttempt = {
          first_name: 'Popeye',
          last_name: 'The Sailor Man',
          email: 'popeye@hotmail.com',
          user_name: 'popeye',
          password: 'popeyepassword',
        };

        it(`responds with a 400 error when ${field} is missing`, () => {
          delete registerAttempt[field];
          return supertest(app)
            .post('/api/users')
            .send(registerAttempt)
            .expect(400, {
              error: { message: `Missing '${field}' in request body` },
            });
        });
      });

      it('responds with 400 "Password must be longer than 8 characters" when empty password', () => {
        const shortPassUser = {
          first_name: 'Popeye',
          last_name: 'The Sailor Man',
          email: 'popeye@hotmail.com',
          user_name: 'popeye',
          password: 'pop',
        };

        return supertest(app)
          .post('/api/users')
          .send(shortPassUser)
          .expect(400, {
            error: { message: 'Password must be longer than 8 characters' },
          });
      });

      it('responds with 400 "Password must be shorter than 72 characters" when long password', () => {
        const longPassUser = {
          first_name: 'Popeye',
          last_name: 'The Sailor Man',
          email: 'popeye@hotmail.com',
          user_name: 'popeye',
          password: '*'.repeat(73),
        };

        return supertest(app)
          .post('/api/users')
          .send(longPassUser)
          .expect(400, {
            error: { message: 'Password must be less than 72 characters' },
          });
      });
      it('responds with 400 "Password cannot begin with a space" when space at beginning of password', () => {
        const spaceBeforePassUser = {
          first_name: 'Popeye',
          last_name: 'The Sailor Man',
          email: 'popeye@hotmail.com',
          user_name: 'popeye',
          password: ' popeyepassword',
        };

        return supertest(app)
          .post('/api/users')
          .send(spaceBeforePassUser)
          .expect(400, {
            error: { message: 'Password must not start or end with a space' },
          });
      });
      it('responds with 400 "Password cannot end with a space" when space at end of password', () => {
        const spaceAfterPassUser = {
          first_name: 'Popeye',
          last_name: 'The Sailor Man',
          email: 'popeye@hotmail.com',
          user_name: 'popeye',
          password: 'popeyepassword ',
        };

        return supertest(app)
          .post('/api/users')
          .send(spaceAfterPassUser)
          .expect(400, {
            error: { message: 'Password must not start or end with a space' },
          });
      });
      it('responds with 400 error when password isnt complex enough,', () => {
        const badPassUser = {
          first_name: 'Popeye',
          last_name: 'The Sailor Man',
          email: 'popeye@hotmail.com',
          user_name: 'popeye',
          password: '11AAaabb',
        };

        return supertest(app)
          .post('/api/users')
          .send(badPassUser)
          .expect(400, {
            error: {
              message:
                'Password must contain 1 upper case, lower case, number and special character',
            },
          });
      });
      it('responds with 400 error when username is already taken', () => {
        const takenPassUser = {
          first_name: 'Popeye',
          last_name: 'The Sailor Man',
          email: 'popeye@hotmail.com',
          user_name: testUser.user_name,
          password: '11AAaa!!',
        };

        return supertest(app)
          .post('/api/users')
          .send(takenPassUser)
          .expect(400, {
            error: {
              message: 'Username already taken',
            },
          });
      });
    });

    context('Successful submission', () => {
      it('responds with 201, serialized user, storing bcrypt password', () => {
        const newUser = {
          user_name: 'test-user',
          password: '11AAaa!!',
          first_name: 'Test first',
          last_name: 'Test last',
          email: 'email2@gmail.com',
        };

        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect((response) => {
            expect(response.body).to.have.property('id');
            expect(response.body.user_name).to.eql(newUser.user_name);
            expect(response.body.first_name).to.eql(newUser.first_name);
            expect(response.body.last_name).to.eql(newUser.last_name);
            expect(response.body.email).to.eql(newUser.email);
            expect(response.body).to.not.have.property('password');
            expect(response.headers.location).to.eql(
              `/api/users/${response.body.id}`
            );
          })
          .expect((response) => {
            db.from('gift_closet_users')
              .select('*')
              .where({ id: response.body.id })
              .first()
              .then((row) => {
                expect(row.user_name).to.eql(newUser.user_name);
                expect(row.first_name).to.eql(newUser.first_name);
                expect(row.last_name).to.eql(newUser.last_name);
                expect(row.email).to.eql(newUser.email);
                return bcrypt.compare(newUser.password, row.password);
              })
              .then((isMatch) => {
                expect(isMatch).to.be.true;
              });
          });
      });
    });
  });
});
