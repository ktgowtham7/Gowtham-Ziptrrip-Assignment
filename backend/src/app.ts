import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import todoRoutes from './routes/todo.routes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

export const createApp = (): Express => {
  const app = express();

  // CORS middleware allowing origins from frontend
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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
