const biometricsModel = require('./biometrics.model');
const { successResponse, errorResponse } = require('../utils/response');

const processBiometricData = async (req, res) => {
  console.log('=== Biometrics Receive API Called ===');
  console.log('Request Body:', JSON.stringify(req.body, null, 2));
  console.log('User ID:', req.user.userId);
  
  try {
    const { biometricsData } = req.body;
    const userId = req.user.userId;

    console.log('[Biometrics] Processing data for user:', userId);
    console.log('[Biometrics] Number of data points:', biometricsData?.length || 0);

    if (!biometricsData || !Array.isArray(biometricsData)) {
      console.log('[Biometrics] Error: Invalid data format - biometricsData is missing or not an array');
      return errorResponse(res, 400, 'Invalid data format', {
        field: 'biometricsData',
        message: 'Data must be an array'
      });
    }

    for (const data of biometricsData) {
      const { date, time } = data;
      
      console.log('[Biometrics] Processing data point:', {
        date,
        time,
        userId
      });
      
      if (!date || !time) {
        console.log('[Biometrics] Error: Missing required fields in data point:', data);
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
          console.log(`[Biometrics] Error: Invalid numeric value for field ${field}:`, data[field]);
          return errorResponse(res, 400, 'Invalid numeric value', {
            field,
            message: `${field} must be a number`
          });
        }
      }

      try {
        await biometricsModel.insertBiometricData(userId, data);
        console.log('[Biometrics] Successfully inserted data point');
      } catch (dbError) {
        console.error('[Biometrics] Database error for data point:', data);
        console.error('[Biometrics] Database error details:', dbError);
        throw dbError;
      }
    }

    console.log('[Biometrics] All data points processed successfully');
    return successResponse(res, 200, 'Biometrics data received successfully');
  } catch (error) {
    console.error('=== Error in Biometrics Receive API ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    return errorResponse(res, 500, 'Error processing biometric data', { error: error.message });
  }
};

const getBiometricsData = async (req, res) => {
  console.log('=== Biometrics Get API Called ===');
  console.log('User ID:', req.user.userId);
  
  try {
    const userId = req.user.userId;
    console.log('[Biometrics] Fetching data for user:', userId);

    const biometricsData = await biometricsModel.getBiometricsData(userId);
    console.log('[Biometrics] Retrieved data points:', biometricsData.length);
    console.log('[Biometrics] First data point:', biometricsData[0] || 'No data');
    
    return successResponse(res, 200, 'Biometrics data retrieved successfully', {
      biometrics: biometricsData
    });
  } catch (error) {
    console.error('=== Error in Biometrics Get API ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    return errorResponse(res, 500, 'Error retrieving biometrics data', { error: error.message });
  }
};

module.exports = {
  processBiometricData,
  getBiometricsData
}; 