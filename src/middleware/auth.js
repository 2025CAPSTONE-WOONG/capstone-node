const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, '인증 토큰이 필요합니다.', {
        field: 'authorization',
        message: 'No token, authorization denied'
      });
    }

    // Verify token
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user from payload
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return errorResponse(res, 401, '유효하지 않은 토큰입니다.', {
      field: 'token',
      message: 'Token is not valid'
    });
  }
};

module.exports = auth; 