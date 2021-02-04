const mongoose = require('mongoose');

const { Schema } = mongoose;
const bus_bookingSchema = new Schema({
  bus_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'buses',
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  seat_number: {
    type: Number,
    required: true,
  },
});

module.exports = bus_booking = mongoose.model('bus_booking', bus_bookingSchema);
