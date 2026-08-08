import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateTodoInput, Todo, TodoPriority, TodoStatus } from '../types/todo';

const todoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  category: z.string().min(1, 'Category is required'),
  dueDate: z.string().optional(),
  subtasks: z.array(z.object({
    title: z.string().min(1, 'Subtask title is required'),
    completed: z.boolean()
  })),
});

type TodoFormValues = z.infer<typeof todoSchema>;

interface TodoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateTodoInput, editId?: string) => Promise<void> | void;
  initialTodo?: Todo | null;
}

export const TodoFormModal: React.FC<TodoFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTodo,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      category: 'Work',
      dueDate: '',
      subtasks: [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'subtasks'
  });

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (initialTodo) {
      reset({
        title: initialTodo.title,
        description: initialTodo.description || '',
        status: initialTodo.status,
        priority: initialTodo.priority,
        category: initialTodo.category || 'Work',
        dueDate: initialTodo.dueDate ? initialTodo.dueDate.split('T')[0] : '',
        subtasks: initialTodo.subtasks ? initialTodo.subtasks.map(s => ({ title: s.title, completed: s.completed })) : [],
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        category: 'Work',
        dueDate: '',
        subtasks: [],
      });
    }
    setError('');
  }, [initialTodo, isOpen, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data: TodoFormValues) => {
    setLoading(true);
    setError('');
    try {
      const formattedDueDate = data.dueDate ? new Date(data.dueDate).toISOString() : null;
      await onSubmit({
        ...data,
        dueDate: formattedDueDate,
        tags: []
      }, initialTodo?.id);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to save todo');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      append({ title: newSubtaskTitle.trim(), completed: false });
      setNewSubtaskTitle('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {initialTodo ? 'Edit Todo' : 'New Todo'}
          </h2>
          <button onClick={onClose} className="text-textMuted hover:text-textMain text-xl transition-colors">
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/15 text-rose-500 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Title *</label>
            <input
              type="text"
              className={`input-control ${errors.title ? 'border-rose-500 focus:border-rose-500 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.15)]' : ''}`}
              placeholder="e.g. Complete Ziptrrip Tech Assignment"
              {...register('title')}
            />
            {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea
              className="input-control"
              rows={3}
              placeholder="Add details..."
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Status</label>
              <select className="input-control" {...register('status')}>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Priority</label>
              <select className="input-control" {...register('priority')}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Category</label>
              <input
                type="text"
                className={`input-control ${errors.category ? 'border-rose-500' : ''}`}
                placeholder="Work, Personal..."
                {...register('category')}
              />
              {errors.category && <p className="text-rose-500 text-xs mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Due Date</label>
              <input
                type="date"
                className="input-control"
                {...register('dueDate')}
              />
            </div>
          </div>

          {!initialTodo && (
            <div>
              <label className="block text-sm font-semibold mb-1">Subtasks</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="input-control"
                  placeholder="Add subtask title..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                />
                <button type="button" onClick={handleAddSubtask} className="btn-secondary">
                  Add
                </button>
              </div>

              {fields.length > 0 && (
                <div className="flex flex-col gap-2 mt-2 max-h-32 overflow-y-auto">
                  {fields.map((field, idx) => (
                    <div key={field.id} className="flex items-center justify-between p-2 bg-input border border-borderBase rounded-md text-sm">
                      <span className="truncate">• {field.title}</span>
                      <button type="button" onClick={() => remove(idx)} className="text-rose-500 hover:text-rose-400">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : initialTodo ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
