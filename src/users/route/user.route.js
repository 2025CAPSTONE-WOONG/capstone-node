const express = require('express');
const router = express.Router();
const userService = require('../service/user.service');

router.post('/google', userService.googleLogin);

module.exports = router; 