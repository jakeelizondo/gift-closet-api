const express = require('express');
const GiftsService = require('./gifts-service');
const { requireAuth } = require('../middleware/jwt-auth');
const path = require('path');

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

giftsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    // get gifts for user

    GiftsService.getAllGiftsForUser(req.app.get('db'), req.user.id)
      .then((gifts) => {
        return res.status(200).json(GiftsService.serializeGifts(gifts));
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const {
      gift_name,
      gift_cost,
      gift_description,
      gift_url,
      tag_id,
    } = req.body;

    if (!gift_name) {
      return res
        .status(400)
        .json({ error: { message: 'Gift name is required' } });
    }

    const gift = {
      gift_name,
      gift_cost,
      gift_description,
      gift_url,
      user_id: req.user.id,
      tag_id,
    };

    return GiftsService.addGift(req.app.get('db'), gift)
      .then((gift) => {
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${gift.id}`))
          .json(GiftsService.serializeGift(gift));
      })
      .catch(next);
  });

giftsRouter
  .route('/:gift_id')
  .all(requireAuth)
  .all(checkGiftExists)
  .get((req, res, next) => {
    return res.status(200).json(GiftsService.serializeGift(req.gift));
  })
  .delete((req, res, next) => {
    GiftsService.deleteGift(req.app.get('db'), req.params.gift_id)
      .then((numRowsAffected) => {
        console.log(numRowsAffected);
        return res
          .status(204)
          .json({ message: `Success! ${numRowsAffected} item deleted.` });
      })
      .catch(next);
  })
  .patch(jsonBodyParser, (req, res, next) => {
    let { gift_name, gift_cost, gift_description, gift_url, tag_id } = req.body;

    if (!gift_name) {
      return res
        .status(400)
        .json({ error: { message: 'Gift name is required' } });
    }

    if (tag_id === 'delete') {
      tag_id = null;
    }

    const gift = {
      gift_name,
      gift_cost,
      gift_description,
      gift_url,
      tag_id,
    };

    return GiftsService.editGift(req.app.get('db'), gift, req.gift.id)
      .then((gift) => {
        return res
          .status(204)
          .location(path.posix.join(req.originalUrl, `/${gift.id}`))
          .json(GiftsService.serializeGift(gift));
      })
      .catch(next);
  });

module.exports = giftsRouter;
