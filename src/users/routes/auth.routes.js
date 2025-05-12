const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');

// Regular user registration
router.post('/register', authController.register);

// Regular user login
router.post('/login', authController.login);

module.exports = router; 