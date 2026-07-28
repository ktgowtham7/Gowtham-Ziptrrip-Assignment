import dns from 'dns';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { TodoModel } from './models/todo.model';

// Use public DNS resolvers to handle SRV records reliably in Node.js
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (err) {
  console.warn('Could not set custom DNS servers:', err);
}

export const connectMongoDB = async (): Promise<boolean> => {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://dummyemailforwok_db_user:mbkVWacPzxW3BBJX@cluster0.qyyzcef.mongodb.net/ziptrrip_todos?retryWrites=true&w=majority';
  
  console.log('Connecting to MongoDB Atlas database...');
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log('🍃 Connected successfully to MongoDB Atlas Database!');
    await seedInitialData();
    return true;
  } catch (error: any) {
    console.error('❌ Failed to connect to MongoDB Atlas:', error.message || error);
    return false;
  }
};

const seedInitialData = async (): Promise<void> => {
  const count = await TodoModel.countDocuments();
  if (count === 0) {
    console.log('Seeding initial sample todos into MongoDB Atlas...');
    const now = new Date().toISOString();
    const tomorrow = new Date(Date.now() + 86400000).toISOString();
    const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString();

    const todo1Id = uuidv4();
    const todo2Id = uuidv4();
    const todo3Id = uuidv4();

    const sampleTodos = [
      {
        id: todo1Id,
        title: 'Review Ziptrrip Tech Assignment Code',
        description: 'Ensure full coverage for MPA requirements, Express APIs, Unit Tests, and documentation.',
        status: 'in_progress',
        priority: 'urgent',
        category: 'Work',
        dueDate: tomorrow,
        createdAt: now,
        updatedAt: now,
        tags: ['ziptrrip', 'assignment', 'urgent'],
        subtasks: [
          { id: uuidv4(), todoId: todo1Id, title: 'Check Express CRUD Endpoints', completed: true, createdAt: now },
          { id: uuidv4(), todoId: todo1Id, title: 'Verify MongoDB database persistence', completed: true, createdAt: now },
          { id: uuidv4(), todoId: todo1Id, title: 'Run Vitest unit test suite', completed: false, createdAt: now },
        ],
      },
      {
        id: todo2Id,
        title: 'Setup Postman API Collection',
        description: 'Export JSON collection file and REST client .http file with complete sample payloads.',
        status: 'pending',
        priority: 'high',
        category: 'Work',
        dueDate: nextWeek,
        createdAt: now,
        updatedAt: now,
        tags: ['postman', 'api', 'testing'],
        subtasks: [
          { id: uuidv4(), todoId: todo2Id, title: 'Add GET, POST, PUT, PATCH, DELETE requests', completed: false, createdAt: now },
          { id: uuidv4(), todoId: todo2Id, title: 'Add query parameter documentation', completed: false, createdAt: now },
        ],
      },
      {
        id: todo3Id,
        title: 'Design Dark/Light React Multi-Page Application',
        description: 'Build MPA routes for /todos and /todo?id=<todo_id> with rich visual themes.',
        status: 'completed',
        priority: 'medium',
        category: 'Design',
        dueDate: now,
        createdAt: now,
        updatedAt: now,
        tags: ['frontend', 'react', 'mpa'],
        subtasks: [
          { id: uuidv4(), todoId: todo3Id, title: 'Create /todos dashboard view', completed: true, createdAt: now },
          { id: uuidv4(), todoId: todo3Id, title: 'Create /todo?id= view', completed: true, createdAt: now },
        ],
      },
    ];

    await TodoModel.insertMany(sampleTodos);
    console.log('MongoDB Atlas seeded successfully.');
  }
};
