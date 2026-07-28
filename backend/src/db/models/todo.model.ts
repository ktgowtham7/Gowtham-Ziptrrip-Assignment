import mongoose, { Schema, Document } from 'mongoose';

export interface ISubtask {
  id: string;
  todoId: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface ITodo extends Document {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  subtasks: ISubtask[];
}

const SubtaskSchema = new Schema<ISubtask>({
  id: { type: String, required: true },
  todoId: { type: String, required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: String, required: true },
});

const TodoSchema = new Schema<ITodo>({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, required: true, enum: ['pending', 'in_progress', 'completed'], default: 'pending', index: true },
  priority: { type: String, required: true, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium', index: true },
  category: { type: String, required: true, default: 'General', index: true },
  dueDate: { type: String, default: null },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
  tags: { type: [String], default: [] },
  subtasks: { type: [SubtaskSchema], default: [] },
});

export const TodoModel = mongoose.model<ITodo>('Todo', TodoSchema);
