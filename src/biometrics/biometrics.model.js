const db = require('../config/database');

const insertBiometricData = async (userId, biometricData) => {
  const {
    date,
    time,
    step_count,
    calories_burned,
    distance_walked,
    total_sleep_minutes,
    deep_sleep_minutes,
    rem_sleep_minutes,
    light_sleep_minutes,
    avg_heart_rate,
    max_heart_rate,
    min_heart_rate
  } = biometricData;

  const query = `
    INSERT INTO biometrics (
      user_id, date, time, step_count, calories_burned, 
      distance_walked, total_sleep_minutes, deep_sleep_minutes,
      rem_sleep_minutes, light_sleep_minutes, avg_heart_rate,
      max_heart_rate, min_heart_rate
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(query, [
    userId,
    date,
    time,
    step_count || 0,
    calories_burned || 0,
    distance_walked || 0,
    total_sleep_minutes || 0,
    deep_sleep_minutes || 0,
    rem_sleep_minutes || 0,
    light_sleep_minutes || 0,
    avg_heart_rate,
    max_heart_rate,
    min_heart_rate
  ]);

  return result;
};

const getBiometricsData = async (userId) => {
  const query = `
    SELECT 
      id,
      date,
      time,
      step_count,
      calories_burned,
      distance_walked,
      total_sleep_minutes,
      deep_sleep_minutes,
      rem_sleep_minutes,
      light_sleep_minutes,
      avg_heart_rate,
      max_heart_rate,
      min_heart_rate,
      created_at
    FROM biometrics 
    WHERE user_id = ?
    ORDER BY date DESC, time DESC
  `;

  const [rows] = await db.execute(query, [userId]);
  return rows;
};

module.exports = {
  insertBiometricData,
  getBiometricsData
}; 