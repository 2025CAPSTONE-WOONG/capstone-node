const db = require('../../config/database');
const { v4: uuidv4 } = require('uuid');

const create = async (routineData) => {
  const { userId, title, description, startTime, endTime } = routineData;
  const id = uuidv4();
  
  const result = await db.query(
    'INSERT INTO routines (id, user_id, title, description, start_time, end_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [id, userId, title, description, startTime, endTime]
  );
  
  return result.rows[0];
};

const findById = async (id) => {
  const result = await db.query('SELECT * FROM routines WHERE id = $1', [id]);
  return result.rows[0];
};

const findByUserId = async (userId) => {
  const result = await db.query('SELECT * FROM routines WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return result.rows;
};

const update = async (id, routineData) => {
  const { title, description, startTime, endTime, isConfirmed } = routineData;
  const result = await db.query(
    'UPDATE routines SET title = $1, description = $2, start_time = $3, end_time = $4, is_confirmed = $5 WHERE id = $6 RETURNING *',
    [title, description, startTime, endTime, isConfirmed, id]
  );
  return result.rows[0];
};

const deleteById = async (id) => {
  const result = await db.query('DELETE FROM routines WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  create,
  findById,
  findByUserId,
  update,
  deleteById
}; 