const xss = require('xss');

const GiftsService = {
  getAllGiftsForUser(db, user_id) {
    return db.select('*').from('gift_closet_gifts').where({ user_id });
  },

  serializeGift(gift) {
    return {
      id: gift.id,
      gift_name: xss(gift.gift_name),
      gift_cost: gift.gift_cost,
      gift_description: xss(gift.gift_description),
      gift_url: xss(gift.gift_url),
      tag_id: gift.tag_id,
    };
  },

  serializeGifts(gifts) {
    return gifts.map(this.serializeGift);
  },

  getGiftById(db, id) {
    return db.select('*').from('gift_closet_gifts').where({ id }).first();
  },

  addGift(db, gift) {
    return db
      .insert(gift)
      .into('gift_closet_gifts')
      .returning('*')
      .then(([gift]) => {
        return gift;
      })
      .then((gift) => this.getGiftById(db, gift.id));
  },

  deleteGift(db, gift_id) {
    return db('gift_closet_gifts').where({ id: gift_id }).delete();
  },

  editGift(db, gift, id) {
    return db('gift_closet_gifts').where({ id: id }).update(gift);
  },
};

module.exports = GiftsService;
