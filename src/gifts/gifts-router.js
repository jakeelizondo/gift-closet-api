const express = require('express');
const GiftsService = require('./gifts-service');
const { requireAuth } = require('../middleware/jwt-auth');

const giftsRouter = express.Router();
const jsonBodyParser = express.json();

giftsRouter.route('/').get(requireAuth, jsonBodyParser, (req, res, next) => {
  // get gifts for user

  GiftsService.getAllGiftsForUser(req.app.get('db'), req.user.id)
    .then((gifts) => {
      return res.status(200).json(gifts);
    })
    .catch(next);
});

module.exports = giftsRouter;
