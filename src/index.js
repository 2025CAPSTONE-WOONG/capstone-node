require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./users/route/user.route');
const healthRoutes = require('./health/route/health.route');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/health', healthRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 