const express = require('express');
const GiftsService = require('./gifts-service');
const { requireAuth } = require('../middleware/jwt-auth');

const giftsRouter = express.Router();
const jsonBodyParser = express.json();

giftsRouter.route('/').get(requireAuth, jsonBodyParser, (req, res, next) => {});

module.exports = giftsRouter;
