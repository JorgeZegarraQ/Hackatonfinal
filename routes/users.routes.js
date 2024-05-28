const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

router.post('/login', usersController.loginUser);
router.post('/signup', usersController.signUpUser);

module.exports = router;
