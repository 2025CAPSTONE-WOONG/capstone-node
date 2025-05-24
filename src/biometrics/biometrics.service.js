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
      heartRateData,
      totalSleepMinutes,
      deepSleepMinutes,
      remSleepMinutes,
      lightSleepMinutes
    } = req.body;

    console.log('[Biometrics] Processing data for user:', userId);

    // Process step data
    if (stepData && Array.isArray(stepData)) {
      for (const data of stepData) {
        if (!data.date || !data.time || !data.value) {
          return errorResponse(res, 400, 'Invalid step data format', {
            message: 'Each step data point must have date, time, and value'
          });
        }
        await biometricsModel.insertBiometricData(userId, {
          date: data.date,
          time: data.time,
          step_count: data.value
        });
      }
    }

    // Process calories burned data
    if (caloriesBurnedData && Array.isArray(caloriesBurnedData)) {
      for (const data of caloriesBurnedData) {
        if (!data.date || !data.time || !data.value) {
          return errorResponse(res, 400, 'Invalid calories data format', {
            message: 'Each calories data point must have date, time, and value'
          });
        }
        await biometricsModel.insertBiometricData(userId, {
          date: data.date,
          time: data.time,
          calories_burned: data.value
        });
      }
    }

    // Process distance walked data
    if (distanceWalked && Array.isArray(distanceWalked)) {
      for (const data of distanceWalked) {
        if (!data.date || !data.time || !data.value) {
          return errorResponse(res, 400, 'Invalid distance data format', {
            message: 'Each distance data point must have date, time, and value'
          });
        }
        await biometricsModel.insertBiometricData(userId, {
          date: data.date,
          time: data.time,
          distance_walked: data.value
        });
      }
    }

    // Process heart rate data
    if (heartRateData && Array.isArray(heartRateData)) {
      for (const data of heartRateData) {
        if (!data.date || !data.time || !data.value) {
          return errorResponse(res, 400, 'Invalid heart rate data format', {
            message: 'Each heart rate data point must have date, time, and value'
          });
        }
        await biometricsModel.insertBiometricData(userId, {
          date: data.date,
          time: data.time,
          heart_rate: data.value
        });
      }
    }

    // Process sleep data
    if (totalSleepMinutes) {
      await biometricsModel.insertBiometricData(userId, {
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0],
        total_sleep_minutes: totalSleepMinutes
      });
    }

    if (deepSleepMinutes && Array.isArray(deepSleepMinutes)) {
      for (const data of deepSleepMinutes) {
        if (!data.date || !data.time || !data.value) {
          return errorResponse(res, 400, 'Invalid deep sleep data format', {
            message: 'Each deep sleep data point must have date, time, and value'
          });
        }
        await biometricsModel.insertBiometricData(userId, {
          date: data.date,
          time: data.time,
          deep_sleep_minutes: data.value
        });
      }
    }

    if (remSleepMinutes && Array.isArray(remSleepMinutes)) {
      for (const data of remSleepMinutes) {
        if (!data.date || !data.time || !data.value) {
          return errorResponse(res, 400, 'Invalid REM sleep data format', {
            message: 'Each REM sleep data point must have date, time, and value'
          });
        }
        await biometricsModel.insertBiometricData(userId, {
          date: data.date,
          time: data.time,
          rem_sleep_minutes: data.value
        });
      }
    }

    if (lightSleepMinutes && Array.isArray(lightSleepMinutes)) {
      for (const data of lightSleepMinutes) {
        if (!data.date || !data.time || !data.value) {
          return errorResponse(res, 400, 'Invalid light sleep data format', {
            message: 'Each light sleep data point must have date, time, and value'
          });
        }
        await biometricsModel.insertBiometricData(userId, {
          date: data.date,
          time: data.time,
          light_sleep_minutes: data.value
        });
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