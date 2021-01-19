const GiftsService = {
  getAllGiftsForUser(db, user_id) {
    return db.select('*').from('gift_closet_gifts').where({ user_id });
  },
};

module.exports = GiftsService;
