const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const config = require('config');

// Route: POST api/login
// DESC: Log user in
// ACCESS: private

router.post(
    '/',
    [
        // user input validation goes here
        body('email', 'Email is required').not().isEmpty(),
        body('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        // API response

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            // check to find user
            let user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ msg: 'User does not exist' });
            }
            // decrypt password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }
            const payload = {user: {
                userId: user.id,
                role: user.role,
            }}
            jwt.sign(payload, config.get('jwtSecret'),
                {expiresIn: 360000}, (error, token) => {
                    if (error) throw error; res.json({token})})
        } catch (error) {
            console.error(error);
        }
    }

);

module.exports = router;