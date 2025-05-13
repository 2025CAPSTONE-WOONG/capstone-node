require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./users/route/user.route');
const healthRoutes = require('./health/route/health.route');
const routineRoutes = require('./routines/route/routine.route');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/users', userRoutes);
app.use('/health', healthRoutes);
app.use('/routines', routineRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
}); 