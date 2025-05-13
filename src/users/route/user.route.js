const express = require('express');
const router = express.Router();
const userService = require('../service/user.service');

/**
 * @swagger
 * /users/google:
 *   post:
 *     summary: Google login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Google login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     profilePicture:
 *                       type: string
 */
router.post('/google', userService.googleLogin);

module.exports = router; 