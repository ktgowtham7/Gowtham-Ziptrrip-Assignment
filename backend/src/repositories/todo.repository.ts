import { v4 as uuidv4 } from 'uuid';
import { TodoModel, ITodo } from '../db/models/todo.model';
import {
  CreateTodoInput,
  SubTask,
  Todo,
  TodoQueryParams,
  TodoSummaryStats,
  UpdateTodoInput,
} from '../types/todo';

export class TodoRepository {
  private formatTodo(doc: ITodo): Todo {
    return {
      id: doc.id,
      title: doc.title,
      description: doc.description || '',
      status: doc.status,
      priority: doc.priority,
      category: doc.category || 'General',
      dueDate: doc.dueDate || null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      tags: doc.tags || [],
      subtasks: doc.subtasks
        ? doc.subtasks.map((st) => ({
            id: st.id,
            todoId: st.todoId,
            title: st.title,
            completed: Boolean(st.completed),
            createdAt: st.createdAt,
          }))
        : [],
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

    const query: any = {};

    if (search && search.trim() !== '') {
      const term = search.trim();
      query.$or = [
        { title: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { category: { $regex: term, $options: 'i' } },
      ];
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (category) {
      query.category = category;
    }

    const allowedSortFields: Record<string, string> = {
      createdAt: 'createdAt',
      dueDate: 'dueDate',
      priority: 'priority',
      title: 'title',
    };

    const sortColumn = allowedSortFields[sortBy] || 'createdAt';
    const sortDirection = order.toLowerCase() === 'asc' ? 1 : -1;

    const total = await TodoModel.countDocuments(query);
    const offset = (page - 1) * limit;

    const docs = await TodoModel.find(query)
      .sort({ [sortColumn]: sortDirection })
      .skip(offset)
      .limit(limit);

    const todos = docs.map((doc) => this.formatTodo(doc));
    const totalPages = Math.ceil(total / limit) || 1;

    return { todos, total, page, totalPages };
  }

  async findById(id: string): Promise<Todo | null> {
    const doc = await TodoModel.findOne({ id });
    if (!doc) return null;
    return this.formatTodo(doc);
  }

  async create(input: CreateTodoInput): Promise<Todo> {
    const id = uuidv4();
    const now = new Date().toISOString();

    const createdSubtasks: SubTask[] = [];
    if (input.subtasks && input.subtasks.length > 0) {
      for (const st of input.subtasks) {
        createdSubtasks.push({
          id: uuidv4(),
          todoId: id,
          title: st.title,
          completed: Boolean(st.completed),
          createdAt: now,
        });
      }
    }

    const newTodo = await TodoModel.create({
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
    });

    return this.formatTodo(newTodo);
  }

  async update(id: string, input: UpdateTodoInput): Promise<Todo | null> {
    const now = new Date().toISOString();
    const updateData: any = { updatedAt: now };

    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.priority !== undefined) updateData.priority = input.priority;
    if (input.category !== undefined) updateData.category = input.category;
    if (input.dueDate !== undefined) updateData.dueDate = input.dueDate;
    if (input.tags !== undefined) updateData.tags = input.tags;

    const updatedDoc = await TodoModel.findOneAndUpdate({ id }, { $set: updateData }, { new: true });
    if (!updatedDoc) return null;
    return this.formatTodo(updatedDoc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await TodoModel.deleteOne({ id });
    return result.deletedCount > 0;
  }

  async addSubtask(todoId: string, title: string, completed: boolean = false): Promise<SubTask> {
    const stId = uuidv4();
    const now = new Date().toISOString();

    const newSubtask: SubTask = {
      id: stId,
      todoId,
      title,
      completed: Boolean(completed),
      createdAt: now,
    };

    const doc = await TodoModel.findOneAndUpdate(
      { id: todoId },
      { $push: { subtasks: newSubtask }, $set: { updatedAt: now } },
      { new: true }
    );

    if (!doc) {
      throw new Error(`Todo with ID ${todoId} not found`);
    }

    return newSubtask;
  }

  async updateSubtask(subtaskId: string, title?: string, completed?: boolean): Promise<SubTask | null> {
    const doc = await TodoModel.findOne({ 'subtasks.id': subtaskId });
    if (!doc) return null;

    const now = new Date().toISOString();
    let targetSubtask: SubTask | null = null;

    for (const st of doc.subtasks) {
      if (st.id === subtaskId) {
        if (title !== undefined) st.title = title;
        if (completed !== undefined) st.completed = completed;
        targetSubtask = {
          id: st.id,
          todoId: st.todoId,
          title: st.title,
          completed: st.completed,
          createdAt: st.createdAt,
        };
        break;
      }
    }

    doc.updatedAt = now;
    await doc.save();

    return targetSubtask;
  }

  async deleteSubtask(subtaskId: string): Promise<boolean> {
    const now = new Date().toISOString();
    const doc = await TodoModel.findOneAndUpdate(
      { 'subtasks.id': subtaskId },
      { $pull: { subtasks: { id: subtaskId } }, $set: { updatedAt: now } },
      { new: true }
    );

    return doc !== null;
  }

  async getSummaryStats(): Promise<TodoSummaryStats> {
    const total = await TodoModel.countDocuments();
    const completed = await TodoModel.countDocuments({ status: 'completed' });
    const pending = await TodoModel.countDocuments({ status: 'pending' });
    const inProgress = await TodoModel.countDocuments({ status: 'in_progress' });

    const nowIso = new Date().toISOString();
    const overdue = await TodoModel.countDocuments({
      status: { $ne: 'completed' },
      dueDate: { $ne: null, $lt: nowIso },
    });

    const priorityAggregation = await TodoModel.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    const byPriority: Record<string, number> = { low: 0, medium: 0, high: 0, urgent: 0 };
    for (const item of priorityAggregation) {
      if (item._id) {
        byPriority[item._id] = item.count;
      }
    }

    const categoryAggregation = await TodoModel.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const byCategory: Record<string, number> = {};
    for (const item of categoryAggregation) {
      if (item._id) {
        byCategory[item._id] = item.count;
      }
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
