const db = require('../../config/database');
const { v4: uuidv4 } = require('uuid');

const create = async (logData) => {
  const { userId, timestamp, emotion, confidence } = logData;
  const id = uuidv4();
  
  const result = await db.query(
    'INSERT INTO emotion_logs (id, user_id, timestamp, emotion, confidence) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [id, userId, timestamp, emotion, confidence]
  );
  
  return result.rows[0];
};

const findByUserId = async (userId, startDate, endDate) => {
  const result = await db.query(
    'SELECT * FROM emotion_logs WHERE user_id = $1 AND timestamp BETWEEN $2 AND $3 ORDER BY timestamp DESC',
    [userId, startDate, endDate]
  );
  return result.rows;
};

const getEmotionStats = async (userId, startDate, endDate) => {
  const result = await db.query(
    `SELECT emotion, COUNT(*) as count, AVG(confidence) as avg_confidence 
     FROM emotion_logs 
     WHERE user_id = $1 AND timestamp BETWEEN $2 AND $3 
     GROUP BY emotion`,
    [userId, startDate, endDate]
  );
  return result.rows;
};

module.exports = {
  create,
  findByUserId,
  getEmotionStats
}; 