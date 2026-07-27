import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TodoService } from '../src/services/todo.service';
import { TodoRepository } from '../src/repositories/todo.repository';
import { Todo } from '../src/types/todo';

describe('TodoService Unit Tests', () => {
  let todoService: TodoService;
  let mockRepository: any;

  const mockTodo: Todo = {
    id: 'test-uuid-123',
    title: 'Test Todo Title',
    description: 'Test Todo Description',
    status: 'pending',
    priority: 'high',
    category: 'Work',
    dueDate: '2026-12-31T23:59:59.000Z',
    createdAt: '2026-07-27T10:00:00.000Z',
    updatedAt: '2026-07-27T10:00:00.000Z',
    tags: ['test', 'unit'],
    subtasks: [],
  };

  beforeEach(() => {
    mockRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      addSubtask: vi.fn(),
      updateSubtask: vi.fn(),
      deleteSubtask: vi.fn(),
      getSummaryStats: vi.fn(),
    };
    todoService = new TodoService(mockRepository as unknown as TodoRepository);
  });

  describe('getAllTodos', () => {
    it('should return paginated todo list from repository', async () => {
      const mockResult = { todos: [mockTodo], total: 1, page: 1, totalPages: 1 };
      mockRepository.findAll.mockResolvedValue(mockResult);

      const result = await todoService.getAllTodos({ status: 'pending', page: 1, limit: 10 });
      expect(mockRepository.findAll).toHaveBeenCalledWith({ status: 'pending', page: 1, limit: 10 });
      expect(result).toEqual(mockResult);
    });
  });

  describe('getTodoById', () => {
    it('should return todo if found', async () => {
      mockRepository.findById.mockResolvedValue(mockTodo);
      const result = await todoService.getTodoById('test-uuid-123');
      expect(result).toEqual(mockTodo);
    });

    it('should throw 404 error if todo not found', async () => {
      mockRepository.findById.mockResolvedValue(null);
      await expect(todoService.getTodoById('non-existent-id')).rejects.toThrow(
        "Todo with ID 'non-existent-id' not found"
      );
    });
  });

  describe('createTodo', () => {
    it('should trim title and call repository.create', async () => {
      mockRepository.create.mockResolvedValue(mockTodo);

      const input = {
        title: '  Untrimmed Title  ',
        description: 'Description',
        priority: 'high' as const,
      };

      const result = await todoService.createTodo(input);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...input,
        title: 'Untrimmed Title',
        description: 'Description',
      });
      expect(result).toEqual(mockTodo);
    });

    it('should throw error if title is empty or missing', async () => {
      await expect(todoService.createTodo({ title: '   ' })).rejects.toThrow('Title is required');
    });
  });

  describe('updateTodo', () => {
    it('should update todo successfully when valid', async () => {
      mockRepository.findById.mockResolvedValue(mockTodo);
      const updatedMock = { ...mockTodo, title: 'Updated Title' };
      mockRepository.update.mockResolvedValue(updatedMock);

      const result = await todoService.updateTodo('test-uuid-123', { title: 'Updated Title' });
      expect(result.title).toBe('Updated Title');
    });

    it('should throw error if update title is empty string', async () => {
      mockRepository.findById.mockResolvedValue(mockTodo);
      await expect(
        todoService.updateTodo('test-uuid-123', { title: '   ' })
      ).rejects.toThrow('Title cannot be empty');
    });
  });

  describe('deleteTodo', () => {
    it('should return success object when deleted', async () => {
      mockRepository.findById.mockResolvedValue(mockTodo);
      mockRepository.delete.mockResolvedValue(true);

      const result = await todoService.deleteTodo('test-uuid-123');
      expect(result).toEqual({ success: true, id: 'test-uuid-123' });
    });
  });

  describe('addSubtask', () => {
    it('should add subtask successfully', async () => {
      mockRepository.findById.mockResolvedValue(mockTodo);
      const mockSubtask = {
        id: 'st-1',
        todoId: 'test-uuid-123',
        title: 'Subtask 1',
        completed: false,
        createdAt: new Date().toISOString(),
      };
      mockRepository.addSubtask.mockResolvedValue(mockSubtask);

      const result = await todoService.addSubtask('test-uuid-123', 'Subtask 1');
      expect(result).toEqual(mockSubtask);
    });
  });
});
