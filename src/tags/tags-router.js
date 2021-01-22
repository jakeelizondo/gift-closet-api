const express = require('express');
const { requireAuth } = require('../middleware/jwt-auth');
const path = require('path');
const TagsService = require('./tags-service');

const tagsRouter = express.Router();
const jsonBodyParser = express.json();

async function checkTagExists(req, res, next) {
  try {
    const tag = await TagsService.getTagById(
      req.app.get('db'),
      req.params.tag_id
    );

    if (!tag) {
      return res
        .status(404)
        .json({ error: { message: 'Requested tag does not exist' } });
    } else {
      req.tag = tag;
      next();
    }
  } catch (error) {
    next(error);
  }
}

tagsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    TagsService.getAllTagsForUser(req.app.get('db'), req.user.id)
      .then((tags) => {
        return res.status(200).json(TagsService.serializeTags(tags));
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { tag_name } = req.body;
    if (!tag_name) {
      return res
        .status(400)
        .json({ error: { message: 'Missing required field tag_name' } });
    }

    const newTag = { tag_name, user_id: req.user.id };

    TagsService.addNewTag(req.app.get('db'), newTag)
      .then((tag) => {
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${tag.id}`))
          .json(TagsService.serializeTag(tag));
      })
      .catch(next);
  });

tagsRouter
  .route('/:tag_id')
  .all(requireAuth)
  .all(checkTagExists)
  .get((req, res, next) => {
    return res.status(200).json(TagsService.serializeTag(req.tag));
  })
  .delete((req, res, next) => {
    TagsService.deleteTag(req.app.get('db'), req.params.tag_id)
      .then((numRowsAffected) => {
        if (numRowsAffected) {
          return res.status(204).json();
        }
      })
      .catch(next);
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { tag_name } = req.body;

    const updateTag = { tag_name, id: req.params.tag_id };

    TagsService.updateTag(req.app.get('db'), updateTag)
      .then((numUpdated) => {
        if (numUpdated) {
          return res.status(204).json();
        } else {
          return res.status(500).json({
            error: {
              message:
                'Sorry, looks like we were unable to update the tag as requested. Please refresh and try again.',
            },
          });
        }
      })
      .catch(next);
  });

module.exports = tagsRouter;
