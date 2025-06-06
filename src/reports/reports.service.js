const reportsModel = require('./reports.model');
const { successResponse, errorResponse } = require('../utils/response');

const createReport = async (req, res) => {
  console.log('=== Create Report API Called ===');
  console.log('Request Body:', JSON.stringify(req.body, null, 2));
  console.log('User ID:', req.user.userId);
  
  try {
    const userId = req.user.userId;
    const { reportType, content, title } = req.body;

    // 필수 필드 검증
    if (!reportType || !content || !title) {
      return errorResponse(res, 400, 'Missing required fields', {
        field: 'reportType, content, title',
        message: 'Report type, content, and title are required fields'
      });
    }

    // reportType 유효성 검사
    if (!['daily', 'weekly'].includes(reportType)) {
      return errorResponse(res, 400, 'Invalid report type', {
        field: 'reportType',
        message: 'Report type must be either "daily" or "weekly"'
      });
    }

    console.log(`[Reports] Creating ${reportType} report for user:`, userId);

    const result = await reportsModel.insertReport(userId, reportType, content, title);
    console.log('[Reports] Report created successfully:', result.insertId);
    
    return successResponse(res, 201, 'Report created successfully', {
      reportId: result.insertId
    });
  } catch (error) {
    console.error('=== Error in Create Report API ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    return errorResponse(res, 500, 'Error creating report', { error: error.message });
  }
};

const getReports = async (req, res) => {
  console.log('=== Get Reports API Called ===');
  console.log('User ID:', req.user.userId);
  
  try {
    const userId = req.user.userId;
    const { reportType } = req.query;

    // reportType 유효성 검사 (선택적)
    if (reportType && !['daily', 'weekly'].includes(reportType)) {
      return errorResponse(res, 400, 'Invalid report type', {
        field: 'reportType',
        message: 'Report type must be either "daily" or "weekly"'
      });
    }

    console.log(`[Reports] Fetching reports for user:`, userId);
    if (reportType) {
      console.log(`[Reports] Filtering by report type:`, reportType);
    }

    const reports = await reportsModel.getReports(userId, reportType);
    console.log('[Reports] Retrieved reports:', reports.length);
    
    return successResponse(res, 200, 'Reports retrieved successfully', {
      reports: reports
    });
  } catch (error) {
    console.error('=== Error in Get Reports API ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    return errorResponse(res, 500, 'Error retrieving reports', { error: error.message });
  }
};

const createRoutineFeedback = async (req, res) => {
  console.log('=== Create Routine Feedback API Called ===');
  console.log('Request Body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { routineId, focusScore, interruptionCount, emotionSummary, feedbackText } = req.body;

    // 필수 필드 검증
    if (!routineId || focusScore === undefined || interruptionCount === undefined || !emotionSummary || !feedbackText) {
      return errorResponse(res, 400, 'Missing required fields', {
        field: 'routineId, focusScore, interruptionCount, emotionSummary, feedbackText',
        message: 'All fields are required'
      });
    }

    // focusScore 유효성 검사
    if (focusScore < 0 || focusScore > 100) {
      return errorResponse(res, 400, 'Invalid focus score', {
        field: 'focusScore',
        message: 'Focus score must be between 0 and 100'
      });
    }

    // interruptionCount 유효성 검사
    if (interruptionCount < 0) {
      return errorResponse(res, 400, 'Invalid interruption count', {
        field: 'interruptionCount',
        message: 'Interruption count cannot be negative'
      });
    }

    console.log(`[Reports] Creating feedback for routine:`, routineId);

    const result = await reportsModel.insertRoutineFeedback(
      routineId,
      focusScore,
      interruptionCount,
      emotionSummary,
      feedbackText
    );
    console.log('[Reports] Feedback created successfully:', result.insertId);
    
    return successResponse(res, 201, 'Routine feedback created successfully', {
      feedbackId: result.insertId
    });
  } catch (error) {
    console.error('=== Error in Create Routine Feedback API ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    return errorResponse(res, 500, 'Error creating routine feedback', { error: error.message });
  }
};

const getRoutineFeedbacks = async (req, res) => {
  console.log('=== Get Routine Feedbacks API Called ===');
  console.log('Query Parameters:', req.query);
  
  try {
    const { routineId } = req.query;

    // routineId가 있는 경우 숫자로 변환
    const parsedRoutineId = routineId ? parseInt(routineId) : null;

    // routineId가 제공된 경우 유효성 검사
    if (routineId && isNaN(parsedRoutineId)) {
      return errorResponse(res, 400, 'Invalid routine ID', {
        field: 'routineId',
        message: 'Routine ID must be a valid number'
      });
    }

    console.log(`[Reports] Fetching routine feedbacks`);
    if (parsedRoutineId) {
      console.log(`[Reports] Filtering by routine ID:`, parsedRoutineId);
    }

    const feedbacks = await reportsModel.getRoutineFeedbacks(parsedRoutineId);
    console.log('[Reports] Retrieved feedbacks:', feedbacks.length);
    
    return successResponse(res, 200, 'Routine feedbacks retrieved successfully', {
      feedbacks: feedbacks
    });
  } catch (error) {
    console.error('=== Error in Get Routine Feedbacks API ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    return errorResponse(res, 500, 'Error retrieving routine feedbacks', { error: error.message });
  }
};

module.exports = {
  createReport,
  getReports,
  createRoutineFeedback,
  getRoutineFeedbacks
}; 