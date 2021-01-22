const xss = require('xss');

const TagsService = {
  getAllTagsForUser: async function (db, user_id) {
    try {
      const tags = await db('gift_closet_tags')
        .join(
          'gift_closet_gifts',
          'gift_closet_gifts.tag_id',
          '=',
          'gift_closet_tags.id'
        )
        .join(
          'gift_closet_users',
          'gift_closet_users.id',
          '=',
          'gift_closet_gifts.user_id'
        )
        .distinct('gift_closet_tags.id', 'gift_closet_tags.tag_name')
        .where({ 'gift_closet_gifts.user_id': user_id });
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
