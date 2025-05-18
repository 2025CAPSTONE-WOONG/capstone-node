const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const userModel = require('./user.model');
const { successResponse, errorResponse } = require('../utils/response');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  console.log('[Google Login] Starting google login process');
  console.log('[Google Login] Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    // 프론트엔드에서 credential을 전송하지 않은 경우 처리
    if (!req.body.credential) {
      console.log('[Google Login] Error: Missing credential in request body');
      console.log('[Google Login] Received body:', JSON.stringify(req.body, null, 2));
      return errorResponse(res, 400, '구글 인증 정보가 없습니다.', {
        field: 'credential',
        message: 'Google credential is required'
      });
    }

    console.log('[Google Login] Decoding Google credential token');
    const decoded = jwt.decode(req.body.credential);
    console.log('[Google Login] Decoded token:', JSON.stringify({
      email: decoded?.email,
      sub: decoded?.sub,
      name: decoded?.name,
      picture: decoded?.picture
    }, null, 2));

    if (!decoded || !decoded.email) {
      console.log('[Google Login] Error: Invalid decoded token structure');
      return errorResponse(res, 400, '잘못된 구글 인증 정보입니다.', {
        field: 'credential',
        message: 'Invalid Google credential'
      });
    }

    const { email } = decoded;
    console.log('[Google Login] Attempting to find or create user with email:', email);

    // 사용자 찾기 또는 생성
    const user = await userModel.findOrCreateGoogleUser(email);
    console.log('[Google Login] User found/created:', JSON.stringify({
      userId: user.id,
      email: user.email,
      nickname: user.nickname
    }, null, 2));

    // JWT 토큰 생성
    console.log('[Google Login] Generating JWT token');
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('[Google Login] JWT token generated successfully', token);

    console.log('[Google Login] Login process completed successfully');
    return successResponse(res, 200, '구글 로그인이 완료되었습니다.', {
      token,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname
      }
    });
  } catch (error) {
    console.error('[Google Login] Critical error occurred:', error);
    console.error('[Google Login] Error stack:', error.stack);
    return errorResponse(res, 500, '구글 인증에 실패했습니다.', { 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const profileData = req.body;

    // 프로필 업데이트
    const updated = await userModel.updateProfile(userId, profileData);
    if (!updated) {
      return errorResponse(res, 404, '사용자를 찾을 수 없습니다.', {
        field: 'userId',
        message: 'User not found'
      });
    }

    // 업데이트된 프로필 정보 조회
    const profile = await userModel.getProfile(userId);
    
    return successResponse(res, 200, '프로필이 업데이트되었습니다.', profile);
  } catch (error) {
    console.error('Update profile error:', error);
    return errorResponse(res, 500, '프로필 업데이트 중 오류가 발생했습니다.', { error: error.message });
  }
};

const localSignup = async (req, res) => {
  try {
    const { email, password, nickname } = req.body;

    // 이메일 중복 체크
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return errorResponse(res, 400, '이미 사용 중인 이메일입니다.', {
        field: 'email',
        message: 'This email is already registered'
      });
    }

    // 회원가입
    const userId = await userModel.create({ email, password, nickname });

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId, email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return successResponse(res, 201, '회원가입이 완료되었습니다.', {
      token,
      user: {
        id: userId,
        email,
        nickname
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return errorResponse(res, 500, '회원가입 처리 중 오류가 발생했습니다.', { error: error.message });
  }
};

const localLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 사용자 찾기
    const user = await userModel.findByEmail(email);
    if (!user) {
      return errorResponse(res, 401, '이메일 또는 비밀번호가 올바르지 않습니다.', {
        field: 'credentials',
        message: 'Invalid email or password'
      });
    }

    // 비밀번호 확인
    const isMatch = await userModel.verifyPassword(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 401, '이메일 또는 비밀번호가 올바르지 않습니다.', {
        field: 'credentials',
        message: 'Invalid email or password'
      });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return successResponse(res, 200, '로그인이 완료되었습니다.', {
      token,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 500, '로그인 처리 중 오류가 발생했습니다.', { error: error.message });
  }
};

module.exports = {
  googleLogin,
  localSignup,
  localLogin,
  updateProfile
}; 