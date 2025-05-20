const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const biometricsService = require('./biometrics.service');

/**
 * @swagger
 * /data:
 *   get:
 *     summary: Get user's biometrics data
 *     description: Retrieve all biometrics data for the authenticated user
 *     tags: [Biometrics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Biometrics data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     biometrics:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           date:
 *                             type: string
 *                             format: date
 *                           time:
 *                             type: string
 *                             format: time
 *                           step_count:
 *                             type: integer
 *                           calories_burned:
 *                             type: number
 *                           distance_walked:
 *                             type: number
 *                           total_sleep_minutes:
 *                             type: integer
 *                           deep_sleep_minutes:
 *                             type: integer
 *                           rem_sleep_minutes:
 *                             type: integer
 *                           light_sleep_minutes:
 *                             type: integer
 *                           avg_heart_rate:
 *                             type: number
 *                           max_heart_rate:
 *                             type: number
 *                           min_heart_rate:
 *                             type: number
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', auth, biometricsService.getBiometricsData);

/**
 * @swagger
 * /data/receive:
 *   post:
 *     summary: Receive biometric data
 *     description: Receive and store biometric data including steps, calories, sleep, and heart rate
 *     tags: [Biometrics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               biometricsData:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - date
 *                     - time
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date
 *                     time:
 *                       type: string
 *                       format: time
 *                     step_count:
 *                       type: integer
 *                       default: 0
 *                     calories_burned:
 *                       type: number
 *                       default: 0
 *                     distance_walked:
 *                       type: number
 *                       default: 0
 *                     total_sleep_minutes:
 *                       type: integer
 *                       default: 0
 *                     deep_sleep_minutes:
 *                       type: integer
 *                       default: 0
 *                     rem_sleep_minutes:
 *                       type: integer
 *                       default: 0
 *                     light_sleep_minutes:
 *                       type: integer
 *                       default: 0
 *                     avg_heart_rate:
 *                       type: number
 *                     max_heart_rate:
 *                       type: number
 *                     min_heart_rate:
 *                       type: number
 *     responses:
 *       200:
 *         description: Data received successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/receive', auth, biometricsService.processBiometricData);

module.exports = router; 