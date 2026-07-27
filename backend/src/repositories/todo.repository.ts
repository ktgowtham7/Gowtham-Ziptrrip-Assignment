import { dbAll, dbGet, dbRun } from '../db/sqlite';
import {
  CreateTodoInput,
  SubTask,
  Todo,
  TodoQueryParams,
  TodoSummaryStats,
  UpdateTodoInput,
} from '../types/todo';
import { v4 as uuidv4 } from 'uuid';

export class TodoRepository {
  private formatTodo(row: any, subtasks: SubTask[] = []): Todo {
    let parsedTags: string[] = [];
    try {
      parsedTags = typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags || [];
    } catch (e) {
      parsedTags = [];
    }

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
      tags: parsedTags,
      subtasks,
    };
  }

  private formatSubtask(row: any): SubTask {
    return {
      id: row.id,
      todoId: row.todoId,
      title: row.title,
      completed: Boolean(row.completed),
      createdAt: row.createdAt,
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

    const conditions: string[] = [];
    const queryParams: any[] = [];

    if (search && search.trim() !== '') {
      conditions.push('(title LIKE ? OR description LIKE ? OR category LIKE ?)');
      const term = `%${search.trim()}%`;
      queryParams.push(term, term, term);
    }

    if (status) {
      conditions.push('status = ?');
      queryParams.push(status);
    }

    if (priority) {
      conditions.push('priority = ?');
      queryParams.push(priority);
    }

    if (category) {
      conditions.push('category = ?');
      queryParams.push(category);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Valid sort fields to prevent SQL injection
    const allowedSortFields: Record<string, string> = {
      createdAt: 'createdAt',
      dueDate: 'dueDate',
      priority: 'priority',
      title: 'title',
    };

    const sortColumn = allowedSortFields[sortBy] || 'createdAt';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Count query
    const countSql = `SELECT COUNT(*) as count FROM todos ${whereClause}`;
    const countResult = await dbGet<{ count: number }>(countSql, queryParams);
    const total = countResult?.count || 0;

    // Pagination query
    const offset = (page - 1) * limit;
    const paginatedSql = `
      SELECT * FROM todos
      ${whereClause}
      ORDER BY ${sortColumn} ${sortOrder}
      LIMIT ? OFFSET ?
    `;

    const rows = await dbAll(paginatedSql, [...queryParams, limit, offset]);

    // Fetch subtasks for returned todos
    const todoIds = rows.map((r) => r.id);
    let subtasksMap: Record<string, SubTask[]> = {};

    if (todoIds.length > 0) {
      const placeholders = todoIds.map(() => '?').join(',');
      const subtaskRows = await dbAll(
        `SELECT * FROM subtasks WHERE todoId IN (${placeholders}) ORDER BY createdAt ASC`,
        todoIds
      );

      for (const stRow of subtaskRows) {
        const st = this.formatSubtask(stRow);
        if (!subtasksMap[st.todoId]) {
          subtasksMap[st.todoId] = [];
        }
        subtasksMap[st.todoId].push(st);
      }
    }

    const todos = rows.map((row) => this.formatTodo(row, subtasksMap[row.id] || []));
    const totalPages = Math.ceil(total / limit) || 1;

    return { todos, total, page, totalPages };
  }

  async findById(id: string): Promise<Todo | null> {
    const row = await dbGet('SELECT * FROM todos WHERE id = ?', [id]);
    if (!row) return null;

    const subtaskRows = await dbAll(
      'SELECT * FROM subtasks WHERE todoId = ? ORDER BY createdAt ASC',
      [id]
    );
    const subtasks = subtaskRows.map((st) => this.formatSubtask(st));

    return this.formatTodo(row, subtasks);
  }

  async create(input: CreateTodoInput): Promise<Todo> {
    const id = uuidv4();
    const now = new Date().toISOString();
    const tagsJson = JSON.stringify(input.tags || []);

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
        tagsJson,
      ]
    );

    const createdSubtasks: SubTask[] = [];
    if (input.subtasks && input.subtasks.length > 0) {
      for (const st of input.subtasks) {
        const stId = uuidv4();
        const isCompleted = st.completed ? 1 : 0;
        await dbRun(
          `INSERT INTO subtasks (id, todoId, title, completed, createdAt) VALUES (?, ?, ?, ?, ?)`,
          [stId, id, st.title, isCompleted, now]
        );
        createdSubtasks.push({
          id: stId,
          todoId: id,
          title: st.title,
          completed: Boolean(st.completed),
          createdAt: now,
        });
      }
    }

    return {
      id,
      title: input.title,
      description: input.description || '',
      status: input.status || 'pending',
      priority: input.priority || 'medium',
      category: input.category || 'General',
      dueDate: input.dueDate || null,
      createdAt: now,
      updatedAt: now,
      tags: input.tags || [],
      subtasks: createdSubtasks,
    };
  }

  async update(id: string, input: UpdateTodoInput): Promise<Todo | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const fields: string[] = [];
    const values: any[] = [];
    const now = new Date().toISOString();

    if (input.title !== undefined) {
      fields.push('title = ?');
      values.push(input.title);
    }
    if (input.description !== undefined) {
      fields.push('description = ?');
      values.push(input.description);
    }
    if (input.status !== undefined) {
      fields.push('status = ?');
      values.push(input.status);
    }
    if (input.priority !== undefined) {
      fields.push('priority = ?');
      values.push(input.priority);
    }
    if (input.category !== undefined) {
      fields.push('category = ?');
      values.push(input.category);
    }
    if (input.dueDate !== undefined) {
      fields.push('dueDate = ?');
      values.push(input.dueDate);
    }
    if (input.tags !== undefined) {
      fields.push('tags = ?');
      values.push(JSON.stringify(input.tags));
    }

    fields.push('updatedAt = ?');
    values.push(now);

    values.push(id);

    await dbRun(`UPDATE todos SET ${fields.join(', ')} WHERE id = ?`, values);

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const res = await dbRun('DELETE FROM todos WHERE id = ?', [id]);
    return res.changes > 0;
  }

  async addSubtask(todoId: string, title: string, completed: boolean = false): Promise<SubTask> {
    const id = uuidv4();
    const now = new Date().toISOString();
    await dbRun(
      `INSERT INTO subtasks (id, todoId, title, completed, createdAt) VALUES (?, ?, ?, ?, ?)`,
      [id, todoId, title, completed ? 1 : 0, now]
    );

    // Update parent todo updatedAt timestamp
    await dbRun('UPDATE todos SET updatedAt = ? WHERE id = ?', [now, todoId]);

    return {
      id,
      todoId,
      title,
      completed,
      createdAt: now,
    };
  }

  async updateSubtask(subtaskId: string, title?: string, completed?: boolean): Promise<SubTask | null> {
    const existing = await dbGet('SELECT * FROM subtasks WHERE id = ?', [subtaskId]);
    if (!existing) return null;

    const fields: string[] = [];
    const values: any[] = [];

    if (title !== undefined) {
      fields.push('title = ?');
      values.push(title);
    }
    if (completed !== undefined) {
      fields.push('completed = ?');
      values.push(completed ? 1 : 0);
    }

    if (fields.length > 0) {
      values.push(subtaskId);
      await dbRun(`UPDATE subtasks SET ${fields.join(', ')} WHERE id = ?`, values);

      const now = new Date().toISOString();
      await dbRun('UPDATE todos SET updatedAt = ? WHERE id = ?', [now, existing.todoId]);
    }

    const updated = await dbGet('SELECT * FROM subtasks WHERE id = ?', [subtaskId]);
    return updated ? this.formatSubtask(updated) : null;
  }

  async deleteSubtask(subtaskId: string): Promise<boolean> {
    const existing = await dbGet('SELECT * FROM subtasks WHERE id = ?', [subtaskId]);
    if (!existing) return false;

    const res = await dbRun('DELETE FROM subtasks WHERE id = ?', [subtaskId]);
    if (res.changes > 0) {
      const now = new Date().toISOString();
      await dbRun('UPDATE todos SET updatedAt = ? WHERE id = ?', [now, existing.todoId]);
      return true;
    }
    return false;
  }

  async getSummaryStats(): Promise<TodoSummaryStats> {
    const totalRow = await dbGet<{ count: number }>('SELECT COUNT(*) as count FROM todos');
    const total = totalRow?.count || 0;

    const statusRows = await dbAll<{ status: string; count: number }>(
      'SELECT status, COUNT(*) as count FROM todos GROUP BY status'
    );

    let completed = 0;
    let pending = 0;
    let inProgress = 0;

    for (const r of statusRows) {
      if (r.status === 'completed') completed = r.count;
      else if (r.status === 'pending') pending = r.count;
      else if (r.status === 'in_progress') inProgress = r.count;
    }

    const nowIso = new Date().toISOString();
    const overdueRow = await dbGet<{ count: number }>(
      `SELECT COUNT(*) as count FROM todos WHERE status != 'completed' AND dueDate IS NOT NULL AND dueDate < ?`,
      [nowIso]
    );
    const overdue = overdueRow?.count || 0;

    const priorityRows = await dbAll<{ priority: string; count: number }>(
      'SELECT priority, COUNT(*) as count FROM todos GROUP BY priority'
    );

    const byPriority: Record<string, number> = { low: 0, medium: 0, high: 0, urgent: 0 };
    for (const r of priorityRows) {
      byPriority[r.priority] = r.count;
    }

    const categoryRows = await dbAll<{ category: string; count: number }>(
      'SELECT category, COUNT(*) as count FROM todos GROUP BY category'
    );

    const byCategory: Record<string, number> = {};
    for (const r of categoryRows) {
      byCategory[r.category] = r.count;
    }

    return {
      total,
      completed,
      pending,
      inProgress,
      overdue,
      byPriority: byPriority as Record<any, number>,
      byCategory,
    };
  }
}
