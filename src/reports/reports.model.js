const db = require('../config/database');

const insertReport = async (userId, reportType, content) => {
  const query = `
    INSERT INTO reports (
      user_id, report_type, content
    ) VALUES (?, ?, ?)
  `;

  const [result] = await db.execute(query, [
    userId,
    reportType,
    JSON.stringify(content)
  ]);

  return result;
};

const getReports = async (userId, reportType = null) => {
  let query = `
    SELECT 
      id,
      user_id,
      report_type,
      content,
      created_at
    FROM reports 
    WHERE user_id = ?
  `;
  
  const params = [userId];
  
  if (reportType) {
    query += ' AND report_type = ?';
    params.push(reportType);
  }
  
  query += ' ORDER BY created_at DESC';

  const [rows] = await db.execute(query, params);
  return rows;
};

module.exports = {
  insertReport,
  getReports
}; 