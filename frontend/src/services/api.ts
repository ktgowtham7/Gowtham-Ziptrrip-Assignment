import axios from 'axios';
import { CreateTodoInput, Todo, TodoQueryParams, TodoSummaryStats, UpdateTodoInput } from '../types/todo';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const todoApi = {
  getTodos: async (params: TodoQueryParams = {}) => {
    const cleanParams: Record<string, any> = {};
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '' && val !== null) {
        cleanParams[key] = val;
      }
    });

    const response = await api.get<{
      success: boolean;
      data: Todo[];
      pagination: { total: number; page: number; totalPages: number; limit: number };
    }>('/todos', { params: cleanParams });

    return response.data;
  },

  getTodoById: async (id: string) => {
    const response = await api.get<{ success: boolean; data: Todo }>(`/todos/${id}`);
    return response.data.data;
  },

  createTodo: async (input: CreateTodoInput) => {
    const response = await api.post<{ success: boolean; data: Todo }>('/todos', input);
    return response.data.data;
  },

  updateTodo: async (id: string, input: UpdateTodoInput) => {
    const response = await api.put<{ success: boolean; data: Todo }>(`/todos/${id}`, input);
    return response.data.data;
  },

  updateStatus: async (id: string, status: 'pending' | 'in_progress' | 'completed') => {
    const response = await api.patch<{ success: boolean; data: Todo }>(`/todos/${id}/status`, { status });
    return response.data.data;
  },

  deleteTodo: async (id: string) => {
    const response = await api.delete<{ success: boolean }>(`/todos/${id}`);
    return response.data;
  },

  addSubtask: async (todoId: string, title: string, completed: boolean = false) => {
    const response = await api.post<{ success: boolean; data: any }>(`/todos/${todoId}/subtasks`, {
      title,
      completed,
    });
    return response.data.data;
  },

  updateSubtask: async (subtaskId: string, title?: string, completed?: boolean) => {
    const response = await api.patch<{ success: boolean; data: any }>(`/todos/subtasks/${subtaskId}`, {
      title,
      completed,
    });
    return response.data.data;
  },

  deleteSubtask: async (subtaskId: string) => {
    const response = await api.delete<{ success: boolean }>(`/todos/subtasks/${subtaskId}`);
    return response.data;
  },

  getSummaryStats: async () => {
    const response = await api.get<{ success: boolean; data: TodoSummaryStats }>('/todos/stats/summary');
    return response.data.data;
  },
};
