const biometricsModel = require('./biometrics.model');
const { successResponse, errorResponse } = require('../utils/response');

const processBiometricData = async (req, res) => {
  try {
    const { biometricsData } = req.body;
    const userId = req.user.userId;

    if (!biometricsData || !Array.isArray(biometricsData)) {
      return errorResponse(res, 400, 'Invalid data format', {
        field: 'biometricsData',
        message: 'Data must be an array'
      });
    }

    for (const data of biometricsData) {
      const { date, time } = data;
      
      if (!date || !time) {
        return errorResponse(res, 400, 'Missing required fields', {
          field: 'date, time',
          message: 'Date and time are required fields'
        });
      }

      // Validate numeric fields
      const numericFields = [
        'step_count', 'calories_burned', 'distance_walked',
        'total_sleep_minutes', 'deep_sleep_minutes', 'rem_sleep_minutes',
        'light_sleep_minutes', 'avg_heart_rate', 'max_heart_rate', 'min_heart_rate'
      ];

      for (const field of numericFields) {
        if (data[field] !== undefined && isNaN(data[field])) {
          return errorResponse(res, 400, 'Invalid numeric value', {
            field,
            message: `${field} must be a number`
          });
        }
      }

      await biometricsModel.insertBiometricData(userId, data);
    }

    return successResponse(res, 200, 'Biometrics data received successfully');
  } catch (error) {
    console.error('Process biometric data error:', error);
    return errorResponse(res, 500, 'Error processing biometric data', { error: error.message });
  }
};

const getBiometricsData = async (req, res) => {
  try {
    const userId = req.user.userId;
    const biometricsData = await biometricsModel.getBiometricsData(userId);
    
    return successResponse(res, 200, 'Biometrics data retrieved successfully', {
      biometrics: biometricsData
    });
  } catch (error) {
    console.error('Get biometrics data error:', error);
    return errorResponse(res, 500, 'Error retrieving biometrics data', { error: error.message });
  }
};

module.exports = {
  processBiometricData,
  getBiometricsData
}; 