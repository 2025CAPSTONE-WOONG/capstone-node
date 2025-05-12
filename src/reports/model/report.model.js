const db = require('../../config/database');
const { v4: uuidv4 } = require('uuid');

const create = async (reportData) => {
  const { userId, reportType, startDate, endDate, summary } = reportData;
  const id = uuidv4();
  
  const result = await db.query(
    'INSERT INTO reports (id, user_id, report_type, start_date, end_date, summary) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [id, userId, reportType, startDate, endDate, summary]
  );
  
  return result.rows[0];
};

const findByUserId = async (userId, reportType = null) => {
  let query = 'SELECT * FROM reports WHERE user_id = $1';
  const params = [userId];
  
  if (reportType) {
    query += ' AND report_type = $2';
    params.push(reportType);
  }
  
  query += ' ORDER BY created_at DESC';
  
  const result = await db.query(query, params);
  return result.rows;
};

const findById = async (id) => {
  const result = await db.query('SELECT * FROM reports WHERE id = $1', [id]);
  return result.rows[0];
};

module.exports = {
  create,
  findByUserId,
  findById
}; 