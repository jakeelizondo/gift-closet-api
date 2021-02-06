const express = require('express');
const AuthService = require('./auth-service');

const jsonBodyParser = express.json();

const authRouter = express.Router();

// This is great, login is a good route name for this purpose
authRouter.post('/login', jsonBodyParser, (req, res, next) => {
  const { user_name, password } = req.body;
  const loginUser = { user_name, password };

  //check to make sure fields are provided

  for (const [key, value] of Object.entries(loginUser)) {
    if (value == null) {
      return res.status(400).json({
        error: { message: `Missing ${key} in request body` },
      });
    }
  }

  //if fields provided, try to get user from database
  AuthService.getUserWithUsername(req.app.get('db'), loginUser.user_name)
    .then((user) => {
      // I could be wrong, as I've never worked with NodeJS backends, but I think if status is not successful (such as not 200, 201, etc.,),
      // I think handling of this error should bein the catch block. I'd check with the instructor though.
      if (!user) {
        return res.status(400).json({
          error: { message: 'Incorrect username or password' },
        });
      }

      //if user is valid, compare login password against db password
      return AuthService.comparePasswords(loginUser.password, user.password) // Nice, and I see that you're decrypting in the service
        .then((isMatch) => {
          if (!isMatch) {
            return res.status(400).json({
              error: { message: 'Incorrect username or password' },
            });
          }

          //if all credentials valid, generate and return jwt to user to use at protected endpoints
          const token = AuthService.makeJwt(loginUser);
          res.send({ token });
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = authRouter;
