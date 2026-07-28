import { v4 as uuidv4 } from 'uuid';
import { dbAll, dbGet, dbRun } from '../db/sqlite';
import {
  CreateTodoInput,
  SubTask,
  Todo,
  TodoQueryParams,
  TodoSummaryStats,
  UpdateTodoInput,
} from '../types/todo';

export class TodoRepository {
  private formatTodo(row: any, subtasks: any[]): Todo {
    return {
      id: row.id,
      title: row.title,
      description: row.description || '',
      status: row.status,
      priority: row.priority,
      category: row.category || 'General',
      dueDate: row.dueDate || null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      tags: row.tags ? JSON.parse(row.tags) : [],
      subtasks: subtasks.map((st) => ({
        id: st.id,
        todoId: st.todoId,
        title: st.title,
        completed: Boolean(st.completed),
        createdAt: st.createdAt,
      })),
    };
  }

  async findAll(params: TodoQueryParams): Promise<{ todos: Todo[]; total: number; page: number; totalPages: number }> {
    const {
      search,
      status,
      priority,
      category,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = params;

    let whereClauses: string[] = [];
    let queryParams: any[] = [];

    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`;
      whereClauses.push(`(title LIKE ? OR description LIKE ? OR category LIKE ?)`);
      queryParams.push(term, term, term);
    }

    if (status) {
      whereClauses.push(`status = ?`);
      queryParams.push(status);
    }

    if (priority) {
      whereClauses.push(`priority = ?`);
      queryParams.push(priority);
    }

    if (category) {
      whereClauses.push(`category = ?`);
      queryParams.push(category);
    }

    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    const countRow = await dbGet<{ total: number }>(`SELECT COUNT(*) as total FROM todos ${whereString}`, queryParams);
    const total = countRow?.total || 0;
    
    const allowedSortFields: Record<string, string> = {
      createdAt: 'createdAt',
      dueDate: 'dueDate',
      priority: 'priority',
      title: 'title',
    };
    const sortColumn = allowedSortFields[sortBy] || 'createdAt';
    const sortDirection = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    const offset = (page - 1) * limit;

    const rows = await dbAll(`SELECT * FROM todos ${whereString} ORDER BY ${sortColumn} ${sortDirection} LIMIT ? OFFSET ?`, [...queryParams, limit, offset]);

    const todos: Todo[] = [];
    for (const row of rows) {
      const subtasks = await dbAll(`SELECT * FROM subtasks WHERE todoId = ? ORDER BY createdAt ASC`, [row.id]);
      todos.push(this.formatTodo(row, subtasks));
    }

    const totalPages = Math.ceil(total / limit) || 1;
    return { todos, total, page, totalPages };
  }

  async findById(id: string): Promise<Todo | null> {
    const row = await dbGet(`SELECT * FROM todos WHERE id = ?`, [id]);
    if (!row) return null;
    const subtasks = await dbAll(`SELECT * FROM subtasks WHERE todoId = ? ORDER BY createdAt ASC`, [id]);
    return this.formatTodo(row, subtasks);
  }

  async create(input: CreateTodoInput): Promise<Todo> {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const tags = JSON.stringify(input.tags || []);
    
    await dbRun(
      `INSERT INTO todos (id, title, description, status, priority, category, dueDate, createdAt, updatedAt, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.title,
        input.description || '',
        input.status || 'pending',
        input.priority || 'medium',
        input.category || 'General',
        input.dueDate || null,
        now,
        now,
        tags
      ]
    );

    const createdSubtasks: any[] = [];
    if (input.subtasks && input.subtasks.length > 0) {
      for (const st of input.subtasks) {
        const stId = uuidv4();
        await dbRun(
          `INSERT INTO subtasks (id, todoId, title, completed, createdAt) VALUES (?, ?, ?, ?, ?)`,
          [stId, id, st.title, st.completed ? 1 : 0, now]
        );
        createdSubtasks.push({ id: stId, todoId: id, title: st.title, completed: st.completed ? 1 : 0, createdAt: now });
      }
    }

    const row = await dbGet(`SELECT * FROM todos WHERE id = ?`, [id]);
    return this.formatTodo(row, createdSubtasks);
  }

  async update(id: string, input: UpdateTodoInput): Promise<Todo | null> {
    const row = await dbGet(`SELECT * FROM todos WHERE id = ?`, [id]);
    if (!row) return null;

    const now = new Date().toISOString();
    let updateClauses: string[] = ['updatedAt = ?'];
    let updateParams: any[] = [now];

    const fields = ['title', 'description', 'status', 'priority', 'category', 'dueDate'];
    for (const field of fields) {
      if ((input as any)[field] !== undefined) {
        updateClauses.push(`${field} = ?`);
        updateParams.push((input as any)[field]);
      }
    }

    if (input.tags !== undefined) {
      updateClauses.push(`tags = ?`);
      updateParams.push(JSON.stringify(input.tags));
    }

    updateParams.push(id);
    await dbRun(`UPDATE todos SET ${updateClauses.join(', ')} WHERE id = ?`, updateParams);

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await dbRun(`DELETE FROM todos WHERE id = ?`, [id]);
    return result.changes > 0;
  }

  async addSubtask(todoId: string, title: string, completed: boolean = false): Promise<SubTask> {
    const stId = uuidv4();
    const now = new Date().toISOString();

    const todo = await dbGet(`SELECT * FROM todos WHERE id = ?`, [todoId]);
    if (!todo) {
      throw new Error(`Todo with ID ${todoId} not found`);
    }

    await dbRun(
      `INSERT INTO subtasks (id, todoId, title, completed, createdAt) VALUES (?, ?, ?, ?, ?)`,
      [stId, todoId, title, completed ? 1 : 0, now]
    );
    
    await dbRun(`UPDATE todos SET updatedAt = ? WHERE id = ?`, [now, todoId]);

    return {
      id: stId,
      todoId,
      title,
      completed,
      createdAt: now,
    };
  }

  async updateSubtask(subtaskId: string, title?: string, completed?: boolean): Promise<SubTask | null> {
    const st = await dbGet(`SELECT * FROM subtasks WHERE id = ?`, [subtaskId]);
    if (!st) return null;

    let updateClauses: string[] = [];
    let updateParams: any[] = [];

    if (title !== undefined) {
      updateClauses.push(`title = ?`);
      updateParams.push(title);
    }
    if (completed !== undefined) {
      updateClauses.push(`completed = ?`);
      updateParams.push(completed ? 1 : 0);
    }

    if (updateClauses.length > 0) {
      updateParams.push(subtaskId);
      await dbRun(`UPDATE subtasks SET ${updateClauses.join(', ')} WHERE id = ?`, updateParams);
      
      const now = new Date().toISOString();
      await dbRun(`UPDATE todos SET updatedAt = ? WHERE id = ?`, [now, st.todoId]);
    }

    const updatedSt = await dbGet(`SELECT * FROM subtasks WHERE id = ?`, [subtaskId]);
    return {
      id: updatedSt.id,
      todoId: updatedSt.todoId,
      title: updatedSt.title,
      completed: Boolean(updatedSt.completed),
      createdAt: updatedSt.createdAt,
    };
  }

  async deleteSubtask(subtaskId: string): Promise<boolean> {
    const st = await dbGet(`SELECT * FROM subtasks WHERE id = ?`, [subtaskId]);
    if (!st) return false;

    const result = await dbRun(`DELETE FROM subtasks WHERE id = ?`, [subtaskId]);
    if (result.changes > 0) {
      const now = new Date().toISOString();
      await dbRun(`UPDATE todos SET updatedAt = ? WHERE id = ?`, [now, st.todoId]);
      return true;
    }
    return false;
  }

  async getSummaryStats(): Promise<TodoSummaryStats> {
    const totalRow = await dbGet(`SELECT COUNT(*) as c FROM todos`);
    const completedRow = await dbGet(`SELECT COUNT(*) as c FROM todos WHERE status = 'completed'`);
    const pendingRow = await dbGet(`SELECT COUNT(*) as c FROM todos WHERE status = 'pending'`);
    const inProgressRow = await dbGet(`SELECT COUNT(*) as c FROM todos WHERE status = 'in_progress'`);
    
    const nowIso = new Date().toISOString();
    const overdueRow = await dbGet(`SELECT COUNT(*) as c FROM todos WHERE status != 'completed' AND dueDate IS NOT NULL AND dueDate < ?`, [nowIso]);

    const priorityRows = await dbAll(`SELECT priority, COUNT(*) as count FROM todos GROUP BY priority`);
    const byPriority: Record<string, number> = { low: 0, medium: 0, high: 0, urgent: 0 };
    for (const row of priorityRows) {
      byPriority[row.priority] = row.count;
    }

    const categoryRows = await dbAll(`SELECT category, COUNT(*) as count FROM todos GROUP BY category`);
    const byCategory: Record<string, number> = {};
    for (const row of categoryRows) {
      byCategory[row.category] = row.count;
    }

    return {
      total: totalRow?.c || 0,
      completed: completedRow?.c || 0,
      pending: pendingRow?.c || 0,
      inProgress: inProgressRow?.c || 0,
      overdue: overdueRow?.c || 0,
      byPriority,
      byCategory,
    };
  }
}
