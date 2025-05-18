require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./users/user.route');
const healthRoutes = require('./health/health.route');
const routineRoutes = require('./routines/routine.route');
const biometricsRoutes = require('./biometrics/biometrics.route');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: '*',  // 모든 도메인에서의 접근 허용
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
}); 