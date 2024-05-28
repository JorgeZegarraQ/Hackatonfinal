const User = require('../models/users.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generar token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

exports.loginUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
    
        if (user && (await user.matchPassword(req.body.password))) {
          res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
          });
        } else {
          res.status(401).json({ message: 'Invalid email or password' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Error logging in user', error });
      }
};

exports.signUpUser = async (req, res, next) => {
    try {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            isAdmin: req.body.isAdmin,
        });
        const savedUser = await newUser.save();

        if (savedUser) {
            try {
                res.status(201).json({
                    _id: savedUser._id,
                    name: savedUser.name,
                    email: savedUser.email,
                    isAdmin: savedUser.isAdmin,
                    token: generateToken(savedUser._id),
                });
            }
            catch(anothererror){
                res.status(400).json({ message: anothererror});

            }
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Error signing up ', error });
    }
};