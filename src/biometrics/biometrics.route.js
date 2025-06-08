const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const biometricsService = require('./biometrics.service');

/**
 * @swagger
 * /data:
 *   get:
 *     summary: 사용자의 생체 데이터 조회
 *     description: 인증된 사용자의 지정된 일수 동안의 모든 생체 데이터를 조회합니다
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
 *         description: 데이터를 조회할 일수 (1-30일)
 *     responses:
 *       200:
 *         description: 생체 데이터 조회 성공
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
 *         description: 잘못된 일수 파라미터
 *       401:
 *         description: 인증되지 않음
 *       500:
 *         description: 서버 오류
 */
router.get('/', auth, biometricsService.getBiometricsData);

/**
 * @swagger
 * /data/receive:
 *   post:
 *     summary: 생체 데이터 수신
 *     description: 걸음 수, 칼로리, 수면, 심박수 등의 생체 데이터를 수신하고 저장합니다
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
 *         description: 데이터 수신 성공
 *       400:
 *         description: 잘못된 요청 데이터
 *       401:
 *         description: 인증되지 않음
 *       500:
 *         description: 서버 오류
 */
router.post('/receive', auth, biometricsService.processBiometricData);

/**
 * @swagger
 * /data/batch:
 *   post:
 *     summary: 생체 데이터 일괄 삽입
 *     description: 동일한 유형의 여러 생체 데이터 레코드를 한 번에 삽입합니다
 *     tags: [Biometrics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dataType
 *               - records
 *             properties:
 *               dataType:
 *                 type: string
 *                 enum: [step, calories, distance, deep_sleep, light_sleep, rem_sleep, heart_rate]
 *                 description: 삽입할 생체 데이터 유형
 *               records:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/BiometricDataPoint'
 *     responses:
 *       200:
 *         description: 데이터 일괄 삽입 성공
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
 *                     insertedCount:
 *                       type: integer
 *       400:
 *         description: 잘못된 요청 데이터
 *       401:
 *         description: 인증되지 않음
 *       500:
 *         description: 서버 오류
 */
router.post('/batch', auth, biometricsService.batchProcessBiometricData);

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
 *           description: 날짜
 *         time:
 *           type: string
 *           format: time
 *           description: 시간
 *         value:
 *           type: string
 *           description: 측정값
 */

module.exports = router; 