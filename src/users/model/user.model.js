const db = require('../../config/database');
const { v4: uuidv4 } = require('uuid');

const findByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const create = async (userData) => {
  const { email, name, profilePicture, provider } = userData;
  const id = uuidv4();
  
  const result = await db.query(
    'INSERT INTO users (id, nickname, major, goal, emotion) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [id, name, null, null, null]
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

module.exports = {
  findByEmail,
  create,
  update,
  findById
}; 