const db = require('../../config/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const findByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const create = async (userData) => {
  const { email, name } = userData;
  const id = uuidv4();
  
  const [result] = await db.query(
    'INSERT INTO users (id, email, name, provider) VALUES (?, ?, ?)',
    [id, email, name]
  );
  return result;
};

const update = async (id, userData) => {
  const { nickname, major, goal, emotion } = userData;
  const [result] = await db.query(
    'UPDATE users SET nickname = ?, major = ?, goal = ?, emotion = ? WHERE id = ?',
    [nickname, major, goal, emotion, id]
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

module.exports = {
  findByEmail,
  create,
  update,
  findById,
  verifyPassword
}; 