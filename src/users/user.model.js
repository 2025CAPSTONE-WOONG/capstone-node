const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const findByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const create = async (userData) => {
  const { email, password, nickname } = userData;
  
  // 비밀번호 해싱
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  const query = `
    INSERT INTO users (email, password, nickname)
    VALUES (?, ?, ?)
  `;
  
  const [result] = await db.execute(query, [email, hashedPassword, nickname]);
  return result.insertId;
};

const update = async (id, userData) => {
  const { nickname, major, emotion } = userData;
  const [result] = await db.query(
    'UPDATE users SET nickname = ?, major = ?, emotion = ? WHERE id = ?',
    [nickname, major, emotion, id]
  );
  return result;
};

const findById = async (id) => {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const updateProfile = async (userId, profileData) => {
  const { nickname, major, emotion, biometric } = profileData;
  
  const query = `
    UPDATE users 
    SET 
      nickname = ?,
      major = ?,
      emotion = ?,
      sleep_score = ?,
      stress_level = ?,
      tutorial_completed = true,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  const [result] = await db.execute(query, [
    nickname,
    major,
    emotion,
    biometric.sleepScore,
    biometric.stressLevel,
    userId
  ]);

  return result.affectedRows > 0;
};

const getProfile = async (userId) => {
  const query = `
    SELECT 
      id as userId,
      nickname,
      tutorial_completed as tutorialCompleted,
      routine_recommendation_triggered as routineRecommendationTriggered
    FROM users 
    WHERE id = ?
  `;

  const [rows] = await db.execute(query, [userId]);
  return rows[0];
};

module.exports = {
  findByEmail,
  create,
  update,
  findById,
  verifyPassword,
  updateProfile,
  getProfile
}; 