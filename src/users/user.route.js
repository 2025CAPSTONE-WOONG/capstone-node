const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /users/google:
 *   post:
 *     summary: Google login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Google login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     profilePicture:
 *                       type: string
 */
router.post('/google', userService.googleLogin);

/**
 * @swagger
 * /users/me/profile:
 *   post:
 *     summary: 사용자 초기 정보 등록 + 튜토리얼 완료 처리
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nickname
 *               - major
 *               - goal
 *               - emotion
 *               - biometric
 *             properties:
 *               nickname:
 *                 type: string
 *                 example: "준우"
 *               major:
 *                 type: string
 *                 example: "컴퓨터공학"
 *               goal:
 *                 type: string
 *                 example: "취업 준비"
 *               emotion:
 *                 type: string
 *                 example: "긴장됨"
 *               biometric:
 *                 type: object
 *                 properties:
 *                   sleepScore:
 *                     type: integer
 *                     example: 72
 *                   stressLevel:
 *                     type: integer
 *                     example: 58
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: "1234"
 *                 nickname:
 *                   type: string
 *                   example: "준우"
 *                 tutorialCompleted:
 *                   type: boolean
 *                   example: true
 *                 routineRecommendationTriggered:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/me/profile', auth, userService.updateProfile);

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: 로컬 회원가입
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - nickname
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *               nickname:
 *                 type: string
 *                 example: "홍길동"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     nickname:
 *                       type: string
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Server error
 */
router.post('/signup', userService.localSignup);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: 로컬 로그인
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     nickname:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', userService.localLogin);

module.exports = router; 