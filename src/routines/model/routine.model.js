const db = require('../../config/database');


const confirmRoutine = async (userId, routineData) => {
  const { title, description, startTime } = routineData;
  
  // end_time은 start_time으로부터 30분 후로 설정
  const start_time = new Date(startTime);
  const end_time = new Date(start_time.getTime() + 30 * 60000); // 30분 추가
  
  const query = `
    INSERT INTO routines (user_id, title, description, start_time, end_time, status)
    VALUES (?, ?, ?, ?, ?, 'active')
  `;
  
  const [result] = await db.execute(query, [
    userId,
    title,
    description,
    start_time,
    end_time
  ]);

  return {
    routineId: result.insertId,
    status: 'active'
  };
};

module.exports = {
  confirmRoutine
}; 