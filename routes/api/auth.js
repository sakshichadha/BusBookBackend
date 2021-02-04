const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const mod = require('../../controllers/auth.js');

// get user by token
router.get('/', auth, (req, res) => {
  mod.basic(req, res);
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post('/', (req, res) => {
  mod.authenticate(req, res);
});

module.exports = router;
