const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
// const gravatar = require('gravatar');
const config = require('config');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const User = require('../../models/User');

// Route: POST api/users
// DESC: Create a new user
// ACCESS: public

router.post(
  '/',
  [
    // thsi is the field validation
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Email is required').isEmail(),
    body(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    // checking for errors from the validation

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // deconstrust the body
    const { name, email, password, role } = req.body;

    try {
      // checks to see if the user is already in the DB
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      //sets the user object to get sent to the database
      user = new User({
        name,
        email,
        password,
        role,
      });

      //encrypting the pasword
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //save the user to the database.
      await user.save();

      res.json({ user });
    } catch (error) {
      console.error(error.message);
    }
  }
);

module.exports = router;
