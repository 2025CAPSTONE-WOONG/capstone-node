const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const reportsService = require('./reports.service');

/**
 * @swagger
 * /reports:
 *   post:
 *     summary: Create a new routine report
 *     description: Create a new report for a completed routine
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - duration
 *               - startTime
 *               - success
 *             properties:
 *               duration:
 *                 type: string
 *                 description: Duration of the routine (e.g., "30분")
 *               feedback:
 *                 type: string
 *                 description: Feedback about the routine
 *               reason:
 *                 type: string
 *                 description: Reason for success/failure
 *               recommendedRoutine:
 *                 type: string
 *                 description: Recommended routine name
 *               startTime:
 *                 type: string
 *                 description: Start time of the routine (e.g., "오전 7시")
 *               success:
 *                 type: string
 *                 enum: [P, F]
 *                 description: Whether the routine was completed successfully (P) or failed (F)
 *     responses:
 *       201:
 *         description: Report created successfully
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
 *                     reportId:
 *                       type: integer
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', auth, reportsService.createReport);

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Get user's routine reports
 *     description: Retrieve all routine reports for the authenticated user
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reports retrieved successfully
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
 *                     reports:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           user_id:
 *                             type: integer
 *                           duration:
 *                             type: string
 *                           feedback:
 *                             type: string
 *                           reason:
 *                             type: string
 *                           recommended_routine:
 *                             type: string
 *                           start_time:
 *                             type: string
 *                           success:
 *                             type: string
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', auth, reportsService.getReports);

/**
 * @swagger
 * /reports/feedback:
 *   post:
 *     summary: Create a new routine feedback
 *     description: Create a new feedback for a routine
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - routineId
 *               - focusScore
 *               - interruptionCount
 *               - emotionSummary
 *               - feedbackText
 *             properties:
 *               routineId:
 *                 type: integer
 *                 description: ID of the routine
 *               focusScore:
 *                 type: number
 *                 format: float
 *                 description: Focus score (0-100)
 *               interruptionCount:
 *                 type: integer
 *                 description: Number of interruptions during the routine
 *               emotionSummary:
 *                 type: string
 *                 description: Summary of emotions during the routine
 *               feedbackText:
 *                 type: string
 *                 description: Detailed feedback text
 *     responses:
 *       201:
 *         description: Feedback created successfully
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
 *                     feedbackId:
 *                       type: integer
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/feedback', auth, reportsService.createRoutineFeedback);

/**
 * @swagger
 * /reports/feedback:
 *   get:
 *     summary: Get routine feedbacks with routine information
 *     description: Retrieve all routine feedbacks with their associated routine information
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: routineId
 *         schema:
 *           type: integer
 *         description: Filter feedbacks by routine ID (optional)
 *     responses:
 *       200:
 *         description: Routine feedbacks retrieved successfully
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
 *                     feedbacks:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           routine_id:
 *                             type: integer
 *                           routine_title:
 *                             type: string
 *                           routine_content:
 *                             type: object
 *                           focus_score:
 *                             type: number
 *                             format: float
 *                           interruption_count:
 *                             type: integer
 *                           emotion_summary:
 *                             type: string
 *                           feedback_text:
 *                             type: string
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/feedback', auth, reportsService.getRoutineFeedbacks);

module.exports = router; 