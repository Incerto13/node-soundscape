const mongoose = require('mongoose');

const { Schema } = mongoose;

const eventModel = new Schema({
  date: {
    type: Date,
    required: true,
    unique: false,
  },
  title: {
    type: String,
    required: true,
    unique: false,
  },
  venue: { type: String },
  city: { type: String },
  country: { type: String },
  artists: [{
    type: String,
  }],

},
{ autoIndex: false }, // prevent wierd E11000 duplicate key error

);

module.exports = mongoose.model('Event', eventModel);
