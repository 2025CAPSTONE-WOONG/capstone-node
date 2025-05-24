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
 *                             type: string
 *                             description: Encrypted step count value
 *                           calories_burned:
 *                             type: string
 *                             description: Encrypted calories burned value
 *                           distance_walked:
 *                             type: string
 *                             description: Encrypted distance walked value
 *                           total_sleep_minutes:
 *                             type: string
 *                             description: Encrypted total sleep minutes value
 *                           deep_sleep_minutes:
 *                             type: string
 *                             description: Encrypted deep sleep minutes value
 *                           rem_sleep_minutes:
 *                             type: string
 *                             description: Encrypted REM sleep minutes value
 *                           light_sleep_minutes:
 *                             type: string
 *                             description: Encrypted light sleep minutes value
 *                           heart_rate:
 *                             type: string
 *                             description: Encrypted heart rate value
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
 *     description: Receive and store encrypted biometric data including steps, calories, sleep, and heart rate
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
 *               stepData:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - date
 *                     - time
 *                     - value
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date
 *                     time:
 *                       type: string
 *                       format: time
 *                     value:
 *                       type: string
 *                       description: Encrypted step count value
 *               caloriesBurnedData:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - date
 *                     - time
 *                     - value
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date
 *                     time:
 *                       type: string
 *                       format: time
 *                     value:
 *                       type: string
 *                       description: Encrypted calories burned value
 *               distanceWalked:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - date
 *                     - time
 *                     - value
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date
 *                     time:
 *                       type: string
 *                       format: time
 *                     value:
 *                       type: string
 *                       description: Encrypted distance walked value
 *               heartRateData:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - date
 *                     - time
 *                     - value
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date
 *                     time:
 *                       type: string
 *                       format: time
 *                     value:
 *                       type: string
 *                       description: Encrypted heart rate value
 *               totalSleepMinutes:
 *                 type: string
 *                 description: Encrypted total sleep minutes value
 *               deepSleepMinutes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - date
 *                     - time
 *                     - value
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date
 *                     time:
 *                       type: string
 *                       format: time
 *                     value:
 *                       type: string
 *                       description: Encrypted deep sleep minutes value
 *               remSleepMinutes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - date
 *                     - time
 *                     - value
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date
 *                     time:
 *                       type: string
 *                       format: time
 *                     value:
 *                       type: string
 *                       description: Encrypted REM sleep minutes value
 *               lightSleepMinutes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - date
 *                     - time
 *                     - value
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date
 *                     time:
 *                       type: string
 *                       format: time
 *                     value:
 *                       type: string
 *                       description: Encrypted light sleep minutes value
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