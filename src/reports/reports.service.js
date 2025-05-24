const reportsModel = require('./reports.model');
const { successResponse, errorResponse } = require('../utils/response');

const createReport = async (req, res) => {
  console.log('=== Create Report API Called ===');
  console.log('Request Body:', JSON.stringify(req.body, null, 2));
  console.log('User ID:', req.user.userId);
  
  try {
    const userId = req.user.userId;
    const { reportType, content } = req.body;

    // 필수 필드 검증
    if (!reportType || !content) {
      return errorResponse(res, 400, 'Missing required fields', {
        field: 'reportType, content',
        message: 'Report type and content are required fields'
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

    const result = await reportsModel.insertReport(userId, reportType, content);
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

module.exports = {
  createReport,
  getReports
}; 