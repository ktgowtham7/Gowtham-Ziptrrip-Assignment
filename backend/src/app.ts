import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import todoRoutes from './routes/todo.routes';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './utils/logger';
import { setupSwagger } from './utils/swagger';

dotenv.config();

export const createApp = (): Express => {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS middleware allowing origins from frontend
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Rate Limiting: max 100 requests per 15 minutes per IP
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
  });
  app.use('/api', limiter);

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // HTTP request logging
  app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

  // Setup Swagger API documentation
  setupSwagger(app);

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'OK',
      message: 'Ziptrrip Todo API Server is running smoothly',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount API routes
  app.use('/api/todos', todoRoutes);

  // Global error handler
  app.use(errorHandler);

  return app;
};
