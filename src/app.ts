import express, { Request, Response, NextFunction } from 'express';
import itemRoutes from './routes/itemRoutes';
import userRoutes from './routes/user.route';
import errorResponseHandler from './middlewares/errorHandler';

const app = express(),
  bodyParser = require('body-parser'),
  swaggerJsdoc = require('swagger-jsdoc'),
  swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Express API with Swagger',
      version: '0.1.0',
      description:
        'This is a simple CRUD API application made with Express and documented with Swagger',
    },
  },
  apis: ['./routes/*.ts'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json());

// Routes
const baseUrl = '/api';
app.use(`${baseUrl}/items`, itemRoutes);
app.use(`${baseUrl}/users`, userRoutes);
// Global error handler (should be after routes)

app.use(errorResponseHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: 'error',
    message: `Resource not found at ${req.originalUrl}`,
  });
});

export default app;
