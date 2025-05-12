const db = require('../../config/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const findByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const create = async (userData) => {
  const { email, name, profilePicture, provider, password } = userData;
  const id = uuidv4();
  
  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }
  
  const result = await db.query(
    'INSERT INTO users (id, email, password, nickname, major, goal, emotion) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [id, email, hashedPassword, name, null, null, null]
  );
  
  return result.rows[0];
};

const update = async (id, userData) => {
  const { nickname, major, goal, emotion } = userData;
  const result = await db.query(
    'UPDATE users SET nickname = $1, major = $2, goal = $3, emotion = $4 WHERE id = $5 RETURNING *',
    [nickname, major, goal, emotion, id]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  findByEmail,
  create,
  update,
  findById,
  verifyPassword
}; 