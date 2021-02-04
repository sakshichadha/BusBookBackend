const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const normalize = require('normalize-url');
const bus_booking = require('../models/bus_booking');
const buses = require('../models/buses');
const users = require('../models/users');

const post = async (req, res) => {
  const { name, email, category, password } = req.body;
  try {
    let user = await users.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'User already exists2' }] });
    }

    user = new users({
      name,
      email,
      category,
      password,
    });

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      },
    );
  } catch (err) {
    console.log('Error in users.js');
    res.status(500).send('Server Error');
  }
};
const addBus = async (req, res) => {
  const seats = Array(40).fill(null);
  const { bus_id, from, to, start_time, end_time, date } = req.body;
  try {
    bus = new buses({
      bus_id,
      from,
      to,
      start_time,
      end_time,
      date,
      seats,
    });

    await bus.save();
    console.log('done bus register');
  } catch (err) {
    console.log('Error in buses.js');
    res.status(500).send('Server Error');
  }
};
const viewBuses = async (req, res) => {
  const { from, to, date } = req.body;

  try {
    const bus = await buses.find({ from, to, date });

    res.send(bus);
  } catch (err) {
    console.log('Error in viewbuses.js');
    res.status(500).send('Server Error');
  }
};
const viewBusesAdmin = async (req, res) => {
  try {
    const bus = await buses.find();

    res.send(bus);
  } catch (err) {
    console.log('Error in viewbuses_a.js');
    res.status(500).send('Server Error');
  }
};
const viewBus = async (req, res) => {
  const { bus_id, start_time, end_time, from, to } = req.body;
  try {
    const bus = await buses.findOne({
      bus_id: 'bus_id',
      from: 'from',
      to: 'to',
      start_time: 'start_time',
      end_time: 'end_time',
    });
    res.send(bus);
  } catch (err) {
    console.log('Error in viewbus route');
    res.status(500).send('Server Error');
  }
};
const getBusById = async (req, res) => {
  try {
    const bus = await buses.findById(req.params.bus_id);

    if (!bus)
      return res.status(400).json({ msg: 'there is no profile for this user' });

    return res.json(bus);
  } catch (err) {
    console.error(err.message);

    res.sendStatus(500).send('Server error');
  }
};

const resetBus = async (req, res) => {
  console.log('about to reset');
  const id = req.body.busId;
  try {
    const bus = await buses.findById(id);

    const newSeats = Array(40).fill(null);
    await buses.findByIdAndUpdate(id, { seats: newSeats });
    const updatedBus = await buses.findById(id);
    await bus_booking.deleteMany({ bus_id: id });
    console.log(updatedBus);
    res.json(updatedBus);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500).send('Server error');
  }
};
const details = async (req, res) => {
  const id = req.body.busId;
  const { seatNumber } = req.body;

  try {
    const bus = await buses.findById(id);
    const user_id = bus.seats[seatNumber];
    const user = await users.findById(user_id);
    console.log(user);

    res.json(user);
  } catch (err) {
    console.error(err.message);

    res.sendStatus(500).send('Server error');
  }
};

const bookBus = async (req, res) => {
  const { seatNumber, id } = req.body;
  try {
    const curBus = await buses.findById(id);
    const newSeats = curBus.seats;
    newSeats[seatNumber] = req.user.id;
    await buses.findByIdAndUpdate(id, { seats: newSeats });
    const updatedBus = await buses.findById(id);
    console.log(updatedBus.seats[seatNumber]);
    const bus_book = new bus_booking({
      bus_id: id,
      user_id: req.user.id,
      seat_number: seatNumber,
    });

    await bus_book.save();
    console.log('booking added succesful');
    res.json(updatedBus);
  } catch (err) {
    console.error(err.message);

    res.sendStatus(500).send('Server error');
  }
};

module.exports = {
  post,
  addBus,
  viewBuses,
  viewBusesAdmin,
  viewBus,
  getBusById,
  bookBus,
  resetBus,
  details,
};
