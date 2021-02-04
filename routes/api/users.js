const express = require('express');

const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const normalize = require('normalize-url');
const User = require('../../models/users');
const auth = require('../../middleware/auth');
const mod = require('../../controllers/users.js');
// register
router.post('/', (req, res) => {
  mod.post(req, res);
});
// add bus for the admin
router.post('/addbus', (req, res) => {
  mod.addBus(req, res);
});
// for customer
router.post('/viewbuses_c', (req, res) => {
  mod.viewBuses(req, res);
});
// for customer
router.get('/bus/:bus_id', (req, res) => {
  mod.getBusById(req, res);
});
// for admin
router.get('/viewbuses_a', (req, res) => {
  mod.viewBusesAdmin(req, res);
});
// admin
router.post('/resetbus', (req, res) => {
  mod.resetBus(req, res);
});
// admin
router.post('/details', (req, res) => {
  mod.details(req, res);
});
// customer

router.post('/book_bus', auth, (req, res) => {
  mod.bookBus(req, res);
});
module.exports = router;
