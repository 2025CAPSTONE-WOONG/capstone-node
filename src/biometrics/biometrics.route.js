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
  console.log('[Biometrics] Starting to process biometric data');
  console.log('[Biometrics] User ID:', req.user.userId);
  
  try {
    const { caloriesBurnedData } = req.body;
    console.log('[Biometrics] Received data:', JSON.stringify(caloriesBurnedData, null, 2));
    
    const userId = req.user.userId;

    if (!caloriesBurnedData || !Array.isArray(caloriesBurnedData)) {
      console.log('[Biometrics] Error: Invalid data format received');
      return res.status(400).json({ error: 'Invalid data format' });
    }

    console.log(`[Biometrics] Processing ${caloriesBurnedData.length} data points`);
    
    // Insert each data point into the biometrics table
    for (const data of caloriesBurnedData) {
      const { date, time, value } = data;
      
      if (!date || !time || value === undefined) {
        console.log('[Biometrics] Error: Missing required fields in data point:', data);
        return res.status(400).json({ error: 'Missing required fields' });
      }

      console.log('[Biometrics] Inserting data point:', { date, time, value });
      await pool.query(
        'INSERT INTO biometrics (user_id, date, time, value) VALUES (?, ?, ?, ?)',
        [userId, date, time, value]
      );
      console.log('[Biometrics] Successfully inserted data point');
    }

    console.log('[Biometrics] All data points processed successfully');
    res.status(200).json({ message: 'Data received successfully' });
  } catch (error) {
    console.error('[Biometrics] Critical error occurred:', error);
    console.error('[Biometrics] Error stack:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 