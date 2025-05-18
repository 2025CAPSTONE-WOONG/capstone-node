const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const userModel = require('./user.model');
const { successResponse, errorResponse } = require('../utils/response');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  try {
    // 프론트엔드에서 credential을 전송하지 않은 경우 처리
    if (!req.body.credential) {
      console.log('Received body:', req.body);
      return errorResponse(res, 400, '구글 인증 정보가 없습니다.', {
        field: 'credential',
        message: 'Google credential is required'
      });
    }

    const decoded = jwt.decode(req.body.credential);
    if (!decoded || !decoded.email) {
      return errorResponse(res, 400, '잘못된 구글 인증 정보입니다.', {
        field: 'credential',
        message: 'Invalid Google credential'
      });
    }

    const { email } = decoded;

    // 사용자 찾기 또는 생성
    const user = await userModel.findOrCreateGoogleUser(email);

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return successResponse(res, 200, '구글 로그인이 완료되었습니다.', {
      token,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    return errorResponse(res, 500, '구글 인증에 실패했습니다.', { error: error.message });
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