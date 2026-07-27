import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const dbDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'todos.db');
export const db = new sqlite3.Database(dbPath);

// Promisified helper functions
export const dbRun = (sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export const dbGet = <T = any>(sql: string, params: any[] = []): Promise<T | undefined> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row as T);
    });
  });
};

export const dbAll = <T = any>(sql: string, params: any[] = []): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows as T[]);
    });
  });
};

export const initDatabase = async (): Promise<void> => {
  await dbRun(`PRAGMA foreign_keys = ON;`);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      priority TEXT NOT NULL DEFAULT 'medium',
      category TEXT NOT NULL DEFAULT 'General',
      dueDate TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      tags TEXT NOT NULL DEFAULT '[]'
    );
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS subtasks (
      id TEXT PRIMARY KEY,
      todoId TEXT NOT NULL,
      title TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (todoId) REFERENCES todos(id) ON DELETE CASCADE
    );
  `);

  // Indexing for faster query execution
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_todos_status ON todos(status);`);
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos(priority);`);
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_todos_category ON todos(category);`);
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_subtasks_todoId ON subtasks(todoId);`);

  // Seed data if empty
  const countRow = await dbGet<{ count: number }>('SELECT COUNT(*) as count FROM todos');
  if (countRow && countRow.count === 0) {
    console.log('Seeding initial sample todos into database...');
    const now = new Date().toISOString();
    const tomorrow = new Date(Date.now() + 86400000).toISOString();
    const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString();

    const sampleTodos = [
      {
        id: uuidv4(),
        title: 'Review Ziptrrip Tech Assignment Code',
        description: 'Ensure full coverage for MPA requirements, Express APIs, Unit Tests, and documentation.',
        status: 'in_progress',
        priority: 'urgent',
        category: 'Work',
        dueDate: tomorrow,
        createdAt: now,
        updatedAt: now,
        tags: JSON.stringify(['ziptrrip', 'assignment', 'urgent']),
        subtasks: [
          { title: 'Check Express CRUD Endpoints', completed: 1 },
          { title: 'Verify SQLite database persistence', completed: 1 },
          { title: 'Run Vitest unit test suite', completed: 0 },
        ],
      },
      {
        id: uuidv4(),
        title: 'Setup Postman API Collection',
        description: 'Export JSON collection file and REST client .http file with complete sample payloads.',
        status: 'pending',
        priority: 'high',
        category: 'Work',
        dueDate: nextWeek,
        createdAt: now,
        updatedAt: now,
        tags: JSON.stringify(['postman', 'api', 'testing']),
        subtasks: [
          { title: 'Add GET, POST, PUT, PATCH, DELETE requests', completed: 0 },
          { title: 'Add query parameter documentation', completed: 0 },
        ],
      },
      {
        id: uuidv4(),
        title: 'Design Dark/Light React Multi-Page Application',
        description: 'Build MPA routes for /todos and /todo?id=<todo_id> with rich visual themes.',
        status: 'completed',
        priority: 'medium',
        category: 'Design',
        dueDate: now,
        createdAt: now,
        updatedAt: now,
        tags: JSON.stringify(['frontend', 'react', 'mpa']),
        subtasks: [
          { title: 'Create /todos dashboard view', completed: 1 },
          { title: 'Create /todo?id= view', completed: 1 },
        ],
      },
    ];

    for (const todo of sampleTodos) {
      await dbRun(
        `INSERT INTO todos (id, title, description, status, priority, category, dueDate, createdAt, updatedAt, tags)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          todo.id,
          todo.title,
          todo.description,
          todo.status,
          todo.priority,
          todo.category,
          todo.dueDate,
          todo.createdAt,
          todo.updatedAt,
          todo.tags,
        ]
      );

      for (const st of todo.subtasks) {
        await dbRun(
          `INSERT INTO subtasks (id, todoId, title, completed, createdAt)
           VALUES (?, ?, ?, ?, ?)`,
          [uuidv4(), todo.id, st.title, st.completed, now]
        );
      }
    }
    console.log('Database seeded successfully.');
  }
};
