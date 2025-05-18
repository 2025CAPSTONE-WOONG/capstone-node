const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /data/receive:
 *   post:
 *     summary: Receive biometric data (calories burned)
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
 *               caloriesBurnedData:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date
 *                     time:
 *                       type: string
 *                       format: time
 *                     value:
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
router.post('/receive', auth, async (req, res) => {
  try {
    const { caloriesBurnedData } = req.body;
    const userId = req.user.userId;

    if (!caloriesBurnedData || !Array.isArray(caloriesBurnedData)) {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    // Insert each data point into the biometrics table
    for (const data of caloriesBurnedData) {
      const { date, time, value } = data;
      
      if (!date || !time || value === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      await pool.query(
        'INSERT INTO biometrics (user_id, date, time, value) VALUES (?, ?, ?, ?)',
        [userId, date, time, value]
      );
    }

    res.status(200).json({ message: 'Data received successfully' });
  } catch (error) {
    console.error('Error saving biometric data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 