export type TodoStatus = 'pending' | 'in_progress' | 'completed';
export type TodoPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface SubTask {
  id: string;
  todoId: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;
  priority: TodoPriority;
  category: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  subtasks?: SubTask[];
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  category?: string;
  dueDate?: string | null;
  tags?: string[];
  subtasks?: Array<{ title: string; completed?: boolean }>;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  category?: string;
  dueDate?: string | null;
  tags?: string[];
}

export interface TodoQueryParams {
  search?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  category?: string;
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'title';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface TodoSummaryStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  overdue: number;
  byPriority: Record<TodoPriority, number>;
  byCategory: Record<string, number>;
}
