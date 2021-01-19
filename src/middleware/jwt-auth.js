const AuthService = require('../auth/auth-service');

function requireAuth(req, res, next) {
  // get JWT token out of auth header

  const authToken = req.get('Authorization') || '';
  let bearerToken;

  if (!authToken.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: { message: 'Missing bearer token' } });
  }

  res.send('ok');
}

module.exports = { requireAuth };
