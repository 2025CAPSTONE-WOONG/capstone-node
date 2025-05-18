const routineModel = require('./routine.model');
const { successResponse, errorResponse } = require('../utils/response');


const confirmRoutine = async (req, res) => {
  try {
    const userId = req.user.userId; // JWT에서 추출한 사용자 ID
    const routineData = req.body;

    // 필수 필드 검증
    if (!routineData.title || !routineData.startTime) {
      return errorResponse(res, 400, '필수 정보가 누락되었습니다.', {
        field: 'title, startTime',
        message: 'Title and start time are required'
      });
    }

    // 루틴 확정 및 저장
    const result = await routineModel.confirmRoutine(userId, routineData);
    
    return successResponse(res, 201, '루틴이 확정되었습니다.', result);
  } catch (error) {
    console.error('Confirm routine error:', error);
    return errorResponse(res, 500, '루틴 확정 중 오류가 발생했습니다.', { error: error.message });
  }
};

const getActiveRoutines = async (req, res) => {
  try {
    const userId = req.user.userId;
    const routines = await routineModel.getActiveRoutines(userId);
    
    return successResponse(res, 200, '진행중인 루틴을 조회했습니다.', {
      routines: routines.map(routine => ({
        id: routine.id,
        title: routine.title,
        startTime: routine.startTime,
        description: routine.description,
        goal: routine.goal
      }))
    });
  } catch (error) {
    console.error('Get active routines error:', error);
    return errorResponse(res, 500, '진행중인 루틴 조회 중 오류가 발생했습니다.', { error: error.message });
  }
};

module.exports = {
  confirmRoutine,
  getActiveRoutines
}; 