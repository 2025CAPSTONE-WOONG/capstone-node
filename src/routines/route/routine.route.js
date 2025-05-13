const express = require('express');
const router = express.Router();
const routineService = require('../service/routine.service');

/**
 * @swagger
 * /routines:
 *   post:
 *     summary: Create a new routine
 *     tags: [Routines]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               start_time:
 *                 type: string
 *                 format: date-time
 *               end_time:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [active, completed, missed]
 *     responses:
 *       201:
 *         description: Routine created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 routineId:
 *                   type: integer
 */
router.post('/', routineService.createRoutine);
 
module.exports = router; 