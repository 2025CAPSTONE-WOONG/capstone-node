const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const biometricsService = require('./biometrics.service');

/**
 * @swagger
 * /data:
 *   get:
 *     summary: Get user's biometrics data
 *     description: Retrieve all biometrics data for the authenticated user for the specified number of days
 *     tags: [Biometrics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 30
 *           default: 1
 *         description: Number of days to retrieve data for (1-30 days)
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
 *                           data_type:
 *                             type: string
 *                             enum: [step, calories, distance, deep_sleep, light_sleep, rem_sleep, heart_rate]
 *                           date:
 *                             type: string
 *                             format: date
 *                           time:
 *                             type: string
 *                             format: time
 *                           value:
 *                             type: string
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *       400:
 *         description: Invalid days parameter
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
 *               caloriesBurnedData:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/BiometricDataPoint'
 *               distanceWalked:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/BiometricDataPoint'
 *               deepSleepMinutes:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/BiometricDataPoint'
 *               lightSleepMinutes:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/BiometricDataPoint'
 *               remSleepMinutes:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/BiometricDataPoint'
 *               heartRateData:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/BiometricDataPoint'
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

/**
 * @swagger
 * components:
 *   schemas:
 *     BiometricDataPoint:
 *       type: object
 *       required:
 *         - date
 *         - time
 *         - value
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *         time:
 *           type: string
 *           format: time
 *         value:
 *           type: string
 */

module.exports = router; 