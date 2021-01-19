const express = require('express');
const GiftsService = require('./gifts-service');
const { requireAuth } = require('../middleware/jwt-auth');

const giftsRouter = express.Router();
const jsonBodyParser = express.json();

//function/middleware to check that gift exists for specific gift routes

async function checkGiftExists(req, res, next) {
  try {
    const gift = await GiftsService.getGiftById(
      req.app.get('db'),
      req.params.gift_id
    );

    if (!gift) {
      return res
        .status(404)
        .json({ error: { message: 'Gift does not exist' } });
    }
    req.gift = gift;
    next();
  } catch (error) {
    next(error);
  }
}

giftsRouter.route('/').get(requireAuth, (req, res, next) => {
  // get gifts for user

  GiftsService.getAllGiftsForUser(req.app.get('db'), req.user.id)
    .then((gifts) => {
      return res.status(200).json(GiftsService.serializeGifts(gifts));
    })
    .catch(next);
});

giftsRouter
  .route('/:gift_id')
  .all(requireAuth)
  .all(checkGiftExists)
  .get((req, res, next) => {
    return res.status(200).json(GiftsService.serializeGift(req.gift));
  });

module.exports = giftsRouter;
