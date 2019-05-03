const mongoose = require('mongoose');

const { Schema } = mongoose;

const artistModel = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  bio: { type: String },
  country: { type: String },
  soundcloud: { type: String }

});

module.exports = mongoose.model('Artist', artistModel);
