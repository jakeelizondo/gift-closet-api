const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AuthService = {
  getUserWithUsername(db, user_name) {
    return db('gift_closet_users').where({ user_name }).first();
  },

  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },

  // use jwt library to generate jwt for a provided user

  makeJwt(user) {
    return jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, {
      subject: user.user_name,
      algorithm: 'HS256',
    });
  },
};

module.exports = AuthService;
