const db = require('../config/database');


const confirmRoutine = async (userId, routineData) => {
  const { title, description, startTime, goal } = routineData;
  
  // end_time은 start_time으로부터 30분 후로 설정
  const start_time = new Date(startTime);
  const end_time = new Date(start_time.getTime() + 30 * 60000); // 30분 추가
  
  const query = `
    INSERT INTO routines (user_id, title, description, goal, start_time, end_time, status)
    VALUES (?, ?, ?, ?, ?, ?, 'active')
  `;
  
  const [result] = await db.execute(query, [
    userId,
    title,
    description,
    goal,
    start_time,
    end_time
  ]);

  return {
    routineId: result.insertId,
    status: 'active'
  };
};

const getActiveRoutines = async (userId) => {
  const query = `
    SELECT 
      id,
      title,
      description,
      goal,
      start_time as startTime
    FROM routines 
    WHERE user_id = ? AND status = 'active'
    ORDER BY start_time ASC
  `;

  const [rows] = await db.execute(query, [userId]);
  return rows;
};

module.exports = {
  confirmRoutine,
  getActiveRoutines
}; 