/**
 * 성공 응답을 생성하는 함수
 * @param {Object} res - Express response 객체
 * @param {number} statusCode - HTTP 상태 코드
 * @param {string} message - 성공 메시지
 * @param {Object} data - 응답 데이터
 */
const successResponse = (res, statusCode = 200, message = 'Success', data = null) => {
  const response = {
    success: true,
    message,
    ...(data && { data })
  };
  return res.status(statusCode).json(response);
};

/**
 * 에러 응답을 생성하는 함수
 * @param {Object} res - Express response 객체
 * @param {number} statusCode - HTTP 상태 코드
 * @param {string} message - 에러 메시지
 * @param {Object} errors - 상세 에러 정보 (선택사항)
 */
const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const response = {
    success: false,
    message,
    ...(errors && { errors })
  };
  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse
}; 