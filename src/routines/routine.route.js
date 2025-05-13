const express = require('express');
const router = express.Router();
const routineService = require('./routine.service');
const auth = require('../middleware/auth');


/**
 * @swagger
 * /routines/confirm:
 *   post:
 *     summary: 루틴 확정 및 저장
 *     description: 사용자가 선택한 루틴을 확정하고 저장합니다.
 *     tags: [Routines]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - startTime
 *             properties:
 *               title:
 *                 type: string
 *                 example: "30분 모의 면접"
 *               description:
 *                 type: string
 *                 example: "면접 예상 질문을 정리하고 답변 연습"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-05-01T15:00:00"
 *     responses:
 *       201:
 *         description: 루틴이 성공적으로 확정되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     routineId:
 *                       type: integer
 *                     status:
 *                       type: string
 *       400:
 *         description: 필수 정보가 누락되었습니다.
 *       401:
 *         description: 인증되지 않은 요청입니다.
 *       500:
 *         description: 서버 오류가 발생했습니다.
 */
router.post('/confirm', auth, routineService.confirmRoutine);

module.exports = router; 