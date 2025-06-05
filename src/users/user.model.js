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

const findOrCreateGoogleUser = async (email) => {
  console.log('[findOrCreateGoogleUser] Starting process for email:', email);
  
  // 먼저 이메일로 사용자 찾기
  console.log('[findOrCreateGoogleUser] Searching for existing user');
  const existingUser = await findByEmail(email);
  
  if (existingUser) {
    console.log('[findOrCreateGoogleUser] Existing user found:', JSON.stringify({
      userId: existingUser.id,
      email: existingUser.email,
      nickname: existingUser.nickname
    }, null, 2));
    return existingUser;
  }

  console.log('[findOrCreateGoogleUser] No existing user found, creating new user');
  // 새 사용자 생성
  const query = `
    INSERT INTO users (email, nickname)
    VALUES (?, ?)
  `;
  
  const nickname = email.split('@')[0]; // 이메일에서 닉네임 생성
  console.log('[findOrCreateGoogleUser] Generated nickname:', nickname);
  
  try {
    const [result] = await db.execute(query, [email, nickname]);
    console.log('[findOrCreateGoogleUser] New user created successfully:', JSON.stringify({
      id: result.insertId,
      email,
      nickname
    }, null, 2));
    
    return {
      id: result.insertId,
      email,
      nickname
    };
  } catch (error) {
    console.error('[findOrCreateGoogleUser] Error creating new user:', error);
    console.error('[findOrCreateGoogleUser] Error stack:', error.stack);
    throw error;
  }
};

const getUserDetails = async (userId) => {
  const query = `
    SELECT 
      id,
      nickname,
      name,
      gender,
      age,
      major,
      emotion,
      email,
      created_at,
      updated_at
    FROM users 
    WHERE id = ?
  `;

  const [rows] = await db.execute(query, [userId]);
  return rows[0];
};

const updateUserDetails = async (userId, userData) => {
  // 업데이트할 필드와 값들을 동적으로 구성
  const updateFields = [];
  const updateValues = [];

  // 각 필드가 존재하는 경우에만 업데이트 목록에 추가
  if (userData.nickname !== undefined) {
    updateFields.push('nickname = ?');
    updateValues.push(userData.nickname);
  }
  if (userData.name !== undefined) {
    updateFields.push('name = ?');
    updateValues.push(userData.name);
  }
  if (userData.gender !== undefined) {
    updateFields.push('gender = ?');
    updateValues.push(userData.gender);
  }
  if (userData.age !== undefined) {
    updateFields.push('age = ?');
    updateValues.push(userData.age);
  }
  if (userData.major !== undefined) {
    updateFields.push('major = ?');
    updateValues.push(userData.major);
  }
  if (userData.emotion !== undefined) {
    updateFields.push('emotion = ?');
    updateValues.push(userData.emotion);
  }

  // 업데이트할 필드가 없는 경우
  if (updateFields.length === 0) {
    return false;
  }

  // updated_at은 항상 업데이트
  updateFields.push('updated_at = CURRENT_TIMESTAMP');
  
  // WHERE 절을 위한 userId 추가
  updateValues.push(userId);

  const query = `
    UPDATE users 
    SET ${updateFields.join(', ')}
    WHERE id = ?
  `;

  const [result] = await db.execute(query, updateValues);
  return result.affectedRows > 0;
};

module.exports = {
  findByEmail,
  create,
  update,
  findById,
  verifyPassword,
  updateProfile,
  getProfile,
  findOrCreateGoogleUser,
  getUserDetails,
  updateUserDetails
}; 