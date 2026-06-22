import swaggerJsDoc, { type OAS3Options } from 'swagger-jsdoc';
import schemas from '@/swagger/schemas';
import env from '@/configs/env';

// Swagger configuration
const options: OAS3Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Motrain API',
      version: '1.0.0',
      description: 'RESTful API for Motrain fitness tracking application. Provides endpoints for user authentication, workout tracking, and fitness data management.'
    },
    servers: [
      {
        url: `http://${env.HOST}:${env.PORT}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token obtained from /auth/login endpoint.\n\nExample: `eyJhbGciOiJIUzI1NiIs...`'
        }
      },
      schemas
    }
  },
  apis: ['./src/controllers/*.ts'] // Path to the API routes folders
};

const swaggerDocs = swaggerJsDoc(options);

export default swaggerDocs;
