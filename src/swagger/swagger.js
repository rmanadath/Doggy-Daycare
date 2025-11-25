import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Doggy Daycare API',
      version: '1.0.0',
      description: 'API documentation for the Doggy Daycare REST API',
    },
  },
  apis: ['./src/routes/*.js'], // Where Swagger will look for annotations
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };