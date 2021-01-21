const express = require('express');
const { requireAuth } = require('../middleware/jwt-auth');
const TagsService = require('./tags-service');

const tagsRouter = express.Router();

tagsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    TagsService.getAllTagsForUser(req.app.get('db'), req.user.id)
      .then((tags) => {
        return res.status(200).json(TagsService.serializeTags(tags));
      })
      .catch(next);
  });

tagsRouter
  .route('/:tagId')
  .all(requireAuth)
  .get((req, res, next) => {
    return res.status(200).json();
  });

module.exports = tagsRouter;
