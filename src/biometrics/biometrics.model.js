const db = require('../config/database');

const insertBiometricData = async (userId, dataType, date, time, value) => {
  const query = `
    INSERT INTO biometrics (
      user_id, data_type, date, time, value
    ) VALUES (?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(query, [
    userId,
    dataType,
    date,
    time,
    value
  ]);

  return result;
};

const getBiometricsData = async (userId, days = 1) => {
  const query = `
    SELECT 
      id,
      data_type,
      date,
      time,
      value,
      created_at
    FROM biometrics 
    WHERE user_id = ?
    AND date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
    ORDER BY date DESC, time DESC
  `;

  const [rows] = await db.execute(query, [userId, days]);
  return rows;
};

module.exports = {
  insertBiometricData,
  getBiometricsData
}; 