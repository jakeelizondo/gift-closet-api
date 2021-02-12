const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;
const xss = require('xss');
const bcrypt = require('bcryptjs');

const UsersService = {
  // As I mentioned somewhere else in this code review, I think this validatePassword and other password related operations
  // can be extracted out into a separate class. Maybe name it Password Service. An example will follow.
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters';
    }

    if (password.length > 72) {
      return 'Password must be less than 72 characters';
    }

    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with a space';
    }

    // Good use of constant
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain 1 upper case, lower case, number and special character';
    }
  },
  hasUserWithUsername(db, user_name) {
    return db('gift_closet_users')
      .where({ user_name })
      .first()
      .then((user) => {
        return !!user;
      });
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('gift_closet_users')
      .returning('*')
      .then(([user]) => user);
  },
  serializeUser(user) {
    return {
      id: user.id,
      first_name: xss(user.first_name),
      last_name: xss(user.last_name),
      email: xss(user.email),
      user_name: xss(user.user_name),
    };
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
};

module.exports = UsersService;
