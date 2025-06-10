require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./users/user.route');
const healthRoutes = require('./health/health.route');
const routineRoutes = require('./routines/routine.route');
const biometricsRoutes = require('./biometrics/biometrics.route');
const reportsRoutes = require('./reports/reports.route');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Headers
app.use((req, res, next) => {
  // COOP 헤더 제거 (기본값인 'unsafe-none'으로 설정됨)
  res.removeHeader('Cross-Origin-Opener-Policy');
  
  // CORS 관련 헤더들
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

// CORS configuration
app.use(cors({
  origin: "*", // 프론트엔드 도메인
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  exposedHeaders: ['Cross-Origin-Opener-Policy']
}));
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'none',
    filter: true,
    showCommonExtensions: true,
    tryItOutEnabled: true
  }
}));

// Routes
app.use('/users', userRoutes);
app.use('/health', healthRoutes);
app.use('/routines', routineRoutes);
app.use('/data', biometricsRoutes);
app.use('/reports', reportsRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
}); 