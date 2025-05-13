const db = require('../../config/database');

const create = async (routineData) => {
  const { title, description, start_time, end_time, status } = routineData;
  const query = `
    INSERT INTO routines (user_id, title, description, start_time, end_time, status)
    VALUES (1, ?, ?, ?, ?, ?)
  `;
  
  const [result] = await db.execute(query, [title, description, start_time, end_time, status || 'active']);
  return result.insertId;
};

module.exports = {
  create
}; 