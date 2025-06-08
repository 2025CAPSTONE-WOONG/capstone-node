const biometricsModel = require('./biometrics.model');
const { successResponse, errorResponse } = require('../utils/response');

const processBiometricData = async (req, res) => {
  console.log('=== Biometrics Receive API Called ===');
  console.log('Request Body:', JSON.stringify(req.body, null, 2));
  console.log('User ID:', req.user.userId);
  
  try {
    const userId = req.user.userId;
    const {
      stepData,
      caloriesBurnedData,
      distanceWalked,
      deepSleepMinutes,
      lightSleepMinutes,
      remSleepMinutes,
      heartRateData
    } = req.body;

    console.log('[Biometrics] Processing data for user:', userId);

    // 각 데이터 타입별로 처리
    const dataTypes = {
      step: stepData,
      calories: caloriesBurnedData,
      distance: distanceWalked,
      deep_sleep: deepSleepMinutes,
      light_sleep: lightSleepMinutes,
      rem_sleep: remSleepMinutes,
      heart_rate: heartRateData
    };

    for (const [dataType, dataArray] of Object.entries(dataTypes)) {
      if (!Array.isArray(dataArray)) continue;

      console.log(`[Biometrics] Processing ${dataType} data:`, dataArray.length, 'points');

      for (const data of dataArray) {
        const { date, time, value } = data;
        
        if (!date || !time || !value) {
          console.log('[Biometrics] Error: Missing required fields in data point:', data);
          return errorResponse(res, 400, 'Missing required fields', {
            field: 'date, time, value',
            message: 'Date, time, and value are required fields'
          });
        }

        try {
          await biometricsModel.insertBiometricData(userId, dataType, date, time, value);
          console.log('[Biometrics] Successfully inserted data point for', dataType);
        } catch (dbError) {
          console.error('[Biometrics] Database error for data point:', data);
          console.error('[Biometrics] Database error details:', dbError);
          throw dbError;
        }
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
    const days = parseInt(req.query.days) || 1;

    // days 파라미터 유효성 검사
    if (isNaN(days) || days < 1 || days > 30) {
      return errorResponse(res, 400, 'Invalid days parameter', {
        field: 'days',
        message: 'Days must be a number between 1 and 30'
      });
    }

    console.log(`[Biometrics] Fetching last ${days} days data for user:`, userId);

    const biometricsData = await biometricsModel.getBiometricsData(userId, days);
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

const batchProcessBiometricData = async (req, res) => {
  console.log('=== Biometrics Batch Insert API Called ===');
  console.log('Request Body:', JSON.stringify(req.body, null, 2));
  console.log('User ID:', req.user.userId);
  
  try {
    const userId = req.user.userId;
    const { dataType, records } = req.body;

    if (!dataType || !Array.isArray(records) || records.length === 0) {
      return errorResponse(res, 400, 'Invalid request data', {
        message: 'dataType and non-empty records array are required'
      });
    }

    // Validate all records
    for (const record of records) {
      if (!record.date || !record.time || !record.value) {
        return errorResponse(res, 400, 'Invalid record data', {
          message: 'Each record must have date, time, and value fields'
        });
      }
    }

    console.log(`[Biometrics] Processing batch insert for ${dataType}:`, records.length, 'records');

    const result = await biometricsModel.batchInsertBiometricData(userId, dataType, records);
    console.log('[Biometrics] Batch insert completed successfully');
    
    return successResponse(res, 200, 'Biometrics data batch inserted successfully', {
      insertedCount: result.affectedRows
    });
  } catch (error) {
    console.error('=== Error in Biometrics Batch Insert API ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    return errorResponse(res, 500, 'Error processing batch biometric data', { error: error.message });
  }
};

module.exports = {
  processBiometricData,
  getBiometricsData,
  batchProcessBiometricData
}; 