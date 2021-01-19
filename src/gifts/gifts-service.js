const GiftsService = {
  getAllGiftsForUser(db, userId) {
    return db.select('*').from('gift_closet_gifts').where('user_id', userId);
  },
};

module.exports = GiftsService;
