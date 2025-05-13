const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Capstone Node API',
      version: '1.0.0',
      description: 'API documentation for Capstone Node project',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server'
      },
      {
        url: 'http://15.165.19.114:3000',
        description: 'Production server'
      }
    ],
  },
  apis: ['./src/**/*.js'], // 모든 route/service/model 파일에서 swagger 주석을 읽음
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec; 