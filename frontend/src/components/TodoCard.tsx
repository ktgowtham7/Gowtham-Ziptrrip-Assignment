import React from 'react';
import Link from 'next/link';
import { Todo } from '../types/todo';
import {
  CheckCircle2,
  Circle,
  Calendar,
  Tag,
  ChevronRight,
  Trash2,
  Edit2,
} from 'lucide-react';

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

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'badge-priority-low';
      case 'high':
        return 'badge-priority-high';
      case 'urgent':
        return 'badge-priority-urgent';
      default:
        return 'badge-priority-medium';
    }
  };

  const formattedDueDate = todo.dueDate
    ? new Date(todo.dueDate).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div
      className="card"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        opacity: isCompleted ? 0.85 : 1,
      }}
    >
      <div>
        {/* Top Row: Checkbox, Status & Priority Badges */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => onStatusToggle(todo.id, todo.status)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isCompleted ? '#10b981' : 'var(--text-muted)',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
              }}
              title={`Mark as ${isCompleted ? 'Pending' : 'Completed'}`}
            >
              {isCompleted ? <CheckCircle2 size={22} color="#10b981" /> : <Circle size={22} />}
            </button>

            <span className={`badge badge-${todo.status}`}>
              {todo.status.replace('_', ' ')}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span className={`badge ${getPriorityBadgeClass(todo.priority)}`}>
              {todo.priority}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '3px 8px',
                borderRadius: '6px',
                background: 'var(--bg-input)',
                color: 'var(--text-muted)',
                fontWeight: 500,
              }}
            >
              {todo.category}
            </span>
          </div>
        </div>

        {/* Title linked to detail page /todo?id=<todo.id> */}
        <Link href={`/todo?id=${todo.id}`} style={{ textDecoration: 'none' }}>
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              marginBottom: '6px',
              color: 'var(--text-main)',
              textDecoration: isCompleted ? 'line-through' : 'none',
              lineHeight: 1.4,
            }}
          >
            {todo.title}
          </h3>
        </Link>

        {todo.description && (
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-muted)',
              marginBottom: '14px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as any,
              overflow: 'hidden',
              lineHeight: 1.5,
            }}
          >
            {todo.description}
          </p>
        )}

        {/* Tags */}
        {todo.tags && todo.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
            {todo.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: 'var(--accent-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Tag size={10} /> {tag}
              </span>
            ))}
          </div>
        )}

        {/* Subtask Progress Bar */}
        {totalSubtasks > 0 && (
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Subtasks</span>
              <span>{completedSubtasks}/{totalSubtasks} ({subtaskProgress}%)</span>
            </div>
            <div style={{ height: '5px', width: '100%', background: 'var(--bg-input)', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${subtaskProgress}%`,
                  background: subtaskProgress === 100 ? '#10b981' : '#3b82f6',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Card Footer: Due Date & Actions */}
      <div
        style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '12px',
          marginTop: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Calendar size={13} />
          {formattedDueDate ? `Due: ${formattedDueDate}` : 'No due date'}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => onEdit(todo)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
            title="Edit Todo"
          >
            <Edit2 size={16} />
          </button>

          <button
            onClick={() => onDelete(todo.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-rose)', padding: '4px' }}
            title="Delete Todo"
          >
            <Trash2 size={16} />
          </button>

          <Link
            href={`/todo?id=${todo.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--accent-primary)',
              marginLeft: '4px',
            }}
          >
            Details <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
