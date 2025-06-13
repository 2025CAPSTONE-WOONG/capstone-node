const db = require('../config/database');

const insertReport = async (userId, duration, feedback, reason, recommendedRoutine, startTime, success) => {
  const query = `
    INSERT INTO reports (
      user_id, duration, feedback, reason, recommended_routine, start_time, success
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(query, [
    userId,
    duration,
    feedback,
    reason,
    recommendedRoutine,
    startTime,
    success
  ]);

  return result;
};

const getReports = async (userId) => {
  const query = `
    SELECT 
      id,
      user_id,
      duration,
      feedback,
      reason,
      recommended_routine,
      start_time,
      success,
      created_at
    FROM reports 
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;
  
  const [rows] = await db.execute(query, [userId]);
  return rows;
};

const insertRoutineFeedback = async (routineId, focusScore, interruptionCount, emotionSummary, feedbackText) => {
  const query = `
    INSERT INTO routine_feedbacks (
      routine_id,
      focus_score,
      interruption_count,
      emotion_summary,
      feedback_text
    ) VALUES (?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(query, [
    routineId,
    focusScore,
    interruptionCount,
    emotionSummary,
    feedbackText
  ]);

  return result;
};

const getRoutineFeedbacks = async (routineId = null) => {
  let query = `
    SELECT 
      rf.id,
      rf.routine_id,
      r.title as routine_title,
      r.content as routine_content,
      rf.focus_score,
      rf.interruption_count,
      rf.emotion_summary,
      rf.feedback_text,
      rf.created_at
    FROM routine_feedbacks rf
    JOIN routines r ON rf.routine_id = r.id
  `;
  
  const params = [];
  
  if (routineId) {
    query += ' WHERE rf.routine_id = ?';
    params.push(routineId);
  }
  
  query += ' ORDER BY rf.created_at DESC';

  const [rows] = await db.execute(query, params);
  return rows;
};

module.exports = {
  insertReport,
  getReports,
  insertRoutineFeedback,
  getRoutineFeedbacks
}; 