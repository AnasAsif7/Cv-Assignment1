const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: String,
  newPrice: Number,
  oldPrice: Number,
  homePageImageText: String,
  discountPercentage: Number,
  homePageImage: String,
  descBigImg: String,
  descImg1: String,
  descImg2: String,
  descImg3: String,
  descImg4: String,
  descImg5: String,
  category: String,
  gameTrailerLink: String,
  description: String,
  sysReq: String,
  procReq: String,
  memReq: String,
  rating: { type: Number, min: 0, max: 5 } // Added rating field with constraints
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
