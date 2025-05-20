const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');

const auth = async (req, res, next) => {
  console.log('[Auth] Starting authentication process');
  console.log('[Auth] Request path:', req.path);
  
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    console.log('[Auth] Authorization header present:', !!authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[Auth] Error: Missing or invalid Authorization header format');
      return errorResponse(res, 401, '인증 토큰이 필요합니다.', {
        field: 'authorization',
        message: 'No token, authorization denied'
      });
    }

    // Verify token
    const token = authHeader.replace('Bearer ', '');
    console.log('[Auth] Attempting to verify token');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user from payload
    console.log('[Auth] Token verified successfully. Decoded payload:', {
      userId: decoded.userId,
      email: decoded.email,
      exp: new Date(decoded.exp * 1000).toISOString()
    });
    
    req.user = decoded;
    console.log('[Auth] Authentication successful, proceeding to route handler');
    next();
  } catch (error) {
    console.error('[Auth] Authentication failed:', error.message);
    console.error('[Auth] Error stack:', error.stack);
    return errorResponse(res, 401, '유효하지 않은 토큰입니다.', {
      field: 'token',
      message: 'Token is not valid'
    });
  }
};

module.exports = auth; 