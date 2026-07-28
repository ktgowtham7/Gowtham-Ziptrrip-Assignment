import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { connectMongoDB } from './db/mongodb';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Initialize MongoDB Atlas connection & seed initial data if empty
    await connectMongoDB();

    const app = createApp();

    app.listen(PORT, () => {
      console.log(`🚀 Ziptrrip Todo Backend API (MongoDB) running at http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📝 Todos Endpoint: http://localhost:${PORT}/api/todos`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
