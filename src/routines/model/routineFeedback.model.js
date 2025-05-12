const db = require('../../config/database');
const { v4: uuidv4 } = require('uuid');

const create = async (feedbackData) => {
  const { routineId, interruptCount, focusScore, emotionSummary, liaFeedback } = feedbackData;
  const id = uuidv4();
  
  const result = await db.query(
    'INSERT INTO routine_feedbacks (id, routine_id, interrupt_count, focus_score, emotion_summary, lia_feedback) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [id, routineId, interruptCount, focusScore, emotionSummary, liaFeedback]
  );
  
  return result.rows[0];
};

const findByRoutineId = async (routineId) => {
  const result = await db.query('SELECT * FROM routine_feedbacks WHERE routine_id = $1', [routineId]);
  return result.rows[0];
};

const update = async (id, feedbackData) => {
  const { interruptCount, focusScore, emotionSummary, liaFeedback } = feedbackData;
  const result = await db.query(
    'UPDATE routine_feedbacks SET interrupt_count = $1, focus_score = $2, emotion_summary = $3, lia_feedback = $4 WHERE id = $5 RETURNING *',
    [interruptCount, focusScore, emotionSummary, liaFeedback, id]
  );
  return result.rows[0];
};

module.exports = {
  create,
  findByRoutineId,
  update
}; 