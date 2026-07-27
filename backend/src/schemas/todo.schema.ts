import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
  description: z.string().optional().default(''),
  status: z.enum(['pending', 'in_progress', 'completed']).optional().default('pending'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().default('medium'),
  category: z.string().optional().default('General'),
  dueDate: z.string().nullable().optional().default(null),
  tags: z.array(z.string()).optional().default([]),
  subtasks: z
    .array(
      z.object({
        title: z.string().min(1, 'Subtask title is required'),
        completed: z.boolean().optional().default(false),
      })
    )
    .optional()
    .default([]),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').max(200).optional(),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  category: z.string().optional(),
  dueDate: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed']),
});

export const createSubtaskSchema = z.object({
  title: z.string().min(1, 'Subtask title is required'),
  completed: z.boolean().optional().default(false),
});

export const updateSubtaskSchema = z.object({
  title: z.string().min(1, 'Subtask title is required').optional(),
  completed: z.boolean().optional(),
});
