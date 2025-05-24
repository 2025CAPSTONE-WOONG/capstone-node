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
    heart_rate
  } = biometricData;

  const query = `
    INSERT INTO biometrics (
      user_id, date, time, step_count, calories_burned, 
      distance_walked, total_sleep_minutes, deep_sleep_minutes,
      rem_sleep_minutes, light_sleep_minutes, heart_rate
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(query, [
    userId,
    date,
    time,
    step_count || null,
    calories_burned || null,
    distance_walked || null,
    total_sleep_minutes || null,
    deep_sleep_minutes || null,
    rem_sleep_minutes || null,
    light_sleep_minutes || null,
    heart_rate || null
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
      heart_rate,
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