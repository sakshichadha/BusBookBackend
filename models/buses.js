const { time } = require('console');
const mongoose = require('mongoose');

const { Schema } = mongoose;
const busesSchema = new Schema({
  bus_id: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  start_time: {
    type: String,
    required: true,
  },
  end_time: {
    type: String,
    required: true,
  },
  seats: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'users',
  },
  date: {
    type: Date,
  },
});

module.exports = buses = mongoose.model('buses', busesSchema);
