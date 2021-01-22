const xss = require('xss');

const TagsService = {
  getAllTagsForUser: async function (db, user_id) {
    try {
      const tags = await db
        .select('id', 'tag_name')
        .from('gift_closet_tags')
        .where({ user_id });
      return tags;
    } catch (error) {
      return error;
    }
  },

  getTagById: async function (db, id) {
    try {
      const tag = await db
        .select('*')
        .from('gift_closet_tags')
        .where({ id })
        .first();
      return tag;
    } catch (error) {
      return error;
    }
  },

  addNewTag: async function (db, tag) {
    try {
      const newTag = await db
        .into('gift_closet_tags')
        .insert(tag)
        .returning('*');

      const dbTag = await this.getTagById(db, newTag[0].id);
      delete dbTag['date_created'];

      return dbTag;
    } catch (error) {
      return error;
    }
  },

  deleteTag: async function (db, id) {
    try {
      const numRowsAffected = db('gift_closet_tags').where({ id }).delete();
      return numRowsAffected;
    } catch (error) {
      return error;
    }
  },

  updateTag: async function (db, tag) {
    try {
      const numUpdated = await db('gift_closet_tags')
        .where({ id: tag.id })
        .update({ tag_name: tag.tag_name });

      return numUpdated;
    } catch (error) {
      return error;
    }
  },

  serializeTags(tags) {
    const cleanTags = tags.map(this.serializeTag);
    return cleanTags;
  },

  serializeTag(tag) {
    const { id, tag_name } = tag;
    const cleanTag = {
      id,
      tag_name: xss(tag_name),
    };

    return cleanTag;
  },
};

module.exports = TagsService;
