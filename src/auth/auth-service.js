const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const JWT_ALGORITHM = 'HS256'; // Like this.

const AuthService = {
  getUserWithUsername(db, user_name) {
    return db('gift_closet_users').where({ user_name }).first();
  },

  comparePasswords(password, hash) {
     // I see that you're doing password stuff here and in the UserService as well.
     // It may make sense to create a password service (or some separate JavaScript class that you can reuse for password purposes)
    return bcrypt.compare(password, hash);
  },

  // use jwt library to generate jwt for a provided user

  makeJwt(user) {
    return jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, {
      subject: user.user_name,
      algorithm: JWT_ALGORITHM, // This HS256 can be set as a constant since you're reading it below. I'll make a suggestion
    });
  },

  // use jwt library to verify jwt came from server

  verifyJwt(token) {
    return jwt.verify(token, config.JWT_SECRET, { algorithms: JWT_ALGORITHM });
  },
};

module.exports = AuthService;
