import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Todo } from '../types/todo';

interface TodoCardProps {
  todo: Todo;
  onStatusToggle: (id: string, currentStatus: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export const TodoCard: React.FC<TodoCardProps> = ({
  todo,
  onStatusToggle,
  onEdit,
  onDelete,
}) => {
  const completedSubtasks = todo.subtasks?.filter((st) => st.completed).length || 0;
  const totalSubtasks = todo.subtasks?.length || 0;
  const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const isCompleted = todo.status === 'completed';

  const formattedDueDate = todo.dueDate
    ? new Date(todo.dueDate).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`card p-6 flex flex-col justify-between relative bg-card border border-borderBase rounded-xl shadow-sm hover:shadow-md transition-shadow ${isCompleted ? 'opacity-80' : ''}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={() => onStatusToggle(todo.id, todo.status)}
              className="w-5 h-5 rounded cursor-pointer accent-emerald-400 focus:ring-emerald-500 focus:ring-2"
              title={`Mark as ${isCompleted ? 'Pending' : 'Completed'}`}
            />
            <span className={`badge badge-${todo.status}`}>
              • {todo.status.replace('_', ' ')}
            </span>
          </div>

          <div className="flex gap-2 items-center">
            <span className={`badge badge-priority-${todo.priority}`}>
              {todo.priority}
            </span>
            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-input text-textMuted border border-borderBase shadow-sm">
              {todo.category}
            </span>
          </div>
        </div>

        <Link href={`/todo?id=${todo.id}`} className="block group">
          <h3
            className={`text-lg font-bold mb-2 text-textMain group-hover:text-accent-blue transition-colors leading-tight tracking-tight ${isCompleted ? 'line-through text-textMuted' : ''}`}
          >
            {todo.title}
          </h3>
        </Link>

        {todo.description && (
          <p className="text-sm text-textMuted mb-4 line-clamp-2 leading-relaxed">
            {todo.description}
          </p>
        )}

        {totalSubtasks > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-textMuted font-semibold mb-2">
              <span>Subtasks</span>
              <span>{completedSubtasks}/{totalSubtasks} ({subtaskProgress}%)</span>
            </div>
            <div className="h-1.5 w-full bg-input rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${subtaskProgress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`h-full rounded-full ${subtaskProgress === 100 ? 'bg-emerald-400' : 'bg-blue-400'}`}
              />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-borderBase pt-4 mt-2 flex justify-between items-center">
        <div className="text-xs text-textMuted font-medium flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formattedDueDate ? `Due ${formattedDueDate}` : 'No due date'}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/todo?id=${todo.id}`}
            className="btn-secondary px-3 py-1.5 text-xs font-semibold hover:bg-cardHover flex items-center gap-1"
          >
            View
          </Link>

          <button
            onClick={() => onEdit(todo)}
            className="btn-secondary px-3 py-1.5 text-xs font-semibold hover:bg-cardHover"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(todo.id)}
            className="btn-danger px-3 py-1.5 text-xs font-semibold hover:bg-rose-500/20"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};
