const routineModel = require('../model/routine.model');

const createRoutine = async (req, res) => {
  try {
    const routineData = req.body;
    const routineId = await routineModel.create(routineData);
    
    res.status(201).json({
      message: 'Routine created successfully',
      routineId
    });
  } catch (error) {
    console.error('Create routine error:', error);
    res.status(500).json({ error: 'Failed to create routine' });
  }
};

module.exports = {
  createRoutine
}; 