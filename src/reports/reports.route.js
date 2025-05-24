const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const reportsService = require('./reports.service');

/**
 * @swagger
 * /reports:
 *   post:
 *     summary: Create a new report
 *     description: Create a new daily or weekly report for the authenticated user
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
 *               - reportType
 *               - content
 *             properties:
 *               reportType:
 *                 type: string
 *                 enum: [daily, weekly]
 *                 description: Type of the report
 *               content:
 *                 type: object
 *                 description: Report content in JSON format
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
 *     summary: Get user's reports
 *     description: Retrieve all reports for the authenticated user, optionally filtered by report type
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: reportType
 *         schema:
 *           type: string
 *           enum: [daily, weekly]
 *         description: Filter reports by type (optional)
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
 *                           report_type:
 *                             type: string
 *                             enum: [daily, weekly]
 *                           content:
 *                             type: object
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *       400:
 *         description: Invalid report type parameter
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', auth, reportsService.getReports);

module.exports = router; 