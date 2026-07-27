import { TodoRepository } from '../repositories/todo.repository';
import {
  CreateTodoInput,
  SubTask,
  Todo,
  TodoQueryParams,
  TodoSummaryStats,
  UpdateTodoInput,
} from '../types/todo';

export class TodoService {
  private repository: TodoRepository;

  constructor(repository: TodoRepository = new TodoRepository()) {
    this.repository = repository;
  }

  async getAllTodos(params: TodoQueryParams) {
    return this.repository.findAll(params);
  }

  async getTodoById(id: string): Promise<Todo> {
    const todo = await this.repository.findById(id);
    if (!todo) {
      const error: any = new Error(`Todo with ID '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }
    return todo;
  }

  async createTodo(input: CreateTodoInput): Promise<Todo> {
    if (!input.title || input.title.trim() === '') {
      const error: any = new Error('Title is required');
      error.statusCode = 400;
      throw error;
    }
    return this.repository.create({
      ...input,
      title: input.title.trim(),
      description: input.description?.trim() || '',
    });
  }

  async updateTodo(id: string, input: UpdateTodoInput): Promise<Todo> {
    await this.getTodoById(id); // Ensure exists or throws 404

    if (input.title !== undefined && input.title.trim() === '') {
      const error: any = new Error('Title cannot be empty');
      error.statusCode = 400;
      throw error;
    }

    const updated = await this.repository.update(id, {
      ...input,
      title: input.title ? input.title.trim() : undefined,
    });

    if (!updated) {
      const error: any = new Error('Failed to update todo');
      error.statusCode = 500;
      throw error;
    }

    return updated;
  }

  async updateTodoStatus(id: string, status: 'pending' | 'in_progress' | 'completed'): Promise<Todo> {
    return this.updateTodo(id, { status });
  }

  async deleteTodo(id: string): Promise<{ success: boolean; id: string }> {
    await this.getTodoById(id); // Throws 404 if not found
    const success = await this.repository.delete(id);
    return { success, id };
  }

  async addSubtask(todoId: string, title: string, completed: boolean = false): Promise<SubTask> {
    await this.getTodoById(todoId); // Throws 404 if todo not found
    if (!title || title.trim() === '') {
      const error: any = new Error('Subtask title is required');
      error.statusCode = 400;
      throw error;
    }
    return this.repository.addSubtask(todoId, title.trim(), completed);
  }

  async updateSubtask(subtaskId: string, title?: string, completed?: boolean): Promise<SubTask> {
    const updated = await this.repository.updateSubtask(subtaskId, title?.trim(), completed);
    if (!updated) {
      const error: any = new Error(`Subtask with ID '${subtaskId}' not found`);
      error.statusCode = 404;
      throw error;
    }
    return updated;
  }

  async deleteSubtask(subtaskId: string): Promise<{ success: boolean; id: string }> {
    const success = await this.repository.deleteSubtask(subtaskId);
    if (!success) {
      const error: any = new Error(`Subtask with ID '${subtaskId}' not found`);
      error.statusCode = 404;
      throw error;
    }
    return { success: true, id: subtaskId };
  }

  async getSummaryStats(): Promise<TodoSummaryStats> {
    return this.repository.getSummaryStats();
  }
}
