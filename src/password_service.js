'use strict';

// An example of a separate Password class that you can create to re-use
// for Password operation purposes. This way, any password related stuff,
// you can add and extend here, making the functions re-usable,
// rather than spreading it all over your codebase.

// I didn't test this class, the code may not work, this is just an example

const bcrypt = require('bcryptjs');

class PasswordService {
  REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

  constructor(password) {
    this.password = password;
  }

  valid() {
    if (this.password.length < 8) {
      return 'Password must be longer than 8 characters';
    }

    if (this.password.length > 72) {
      return 'Password must be less than 72 characters';
    }

    if (this.password.startsWith(' ') || this.password.endsWith(' ')) {
      return 'Password must not start or end with a space';
    }

    // Good use of constant
    if (!this.REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(this.password)) {
      return 'Password must contain 1 upper case, lower case, number and special character';
    }
  }

  comparePasswords(hash) {
    return bcrypt.compare(password, hash);
  }
}