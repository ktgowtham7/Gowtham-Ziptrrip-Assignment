import React from 'react';
import Link from 'next/link';
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
    <div
      className="card"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        opacity: isCompleted ? 0.82 : 1,
      }}
    >
      <div>
        {/* Top Badges & Checkbox */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={() => onStatusToggle(todo.id, todo.status)}
              style={{ width: '17px', height: '17px', cursor: 'pointer', accentColor: '#34d399' }}
              title={`Mark as ${isCompleted ? 'Pending' : 'Completed'}`}
            />
            <span className={`badge badge-${todo.status}`}>
              • {todo.status.replace('_', ' ')}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span className={`badge badge-priority-${todo.priority}`}>
              {todo.priority}
            </span>
            <span
              style={{
                fontSize: '0.725rem',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: '6px',
                background: 'var(--bg-input)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-color)',
              }}
            >
              {todo.category}
            </span>
          </div>
        </div>

        {/* Title linked to detail page /todo?id=<todo.id> */}
        <Link href={`/todo?id=${todo.id}`} style={{ textDecoration: 'none', display: 'block' }}>
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              marginBottom: '8px',
              color: 'var(--text-main)',
              textDecoration: isCompleted ? 'line-through' : 'none',
              lineHeight: 1.38,
              letterSpacing: '-0.015em',
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
              marginBottom: '16px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as any,
              overflow: 'hidden',
              lineHeight: 1.55,
            }}
          >
            {todo.description}
          </p>
        )}

        {/* Subtask Progress Bar */}
        {totalSubtasks > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>
              <span>Subtasks</span>
              <span>{completedSubtasks}/{totalSubtasks} ({subtaskProgress}%)</span>
            </div>
            <div style={{ height: '5px', width: '100%', background: 'var(--bg-input)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${subtaskProgress}%`,
                  background: subtaskProgress === 100 ? '#34d399' : '#60a5fa',
                  borderRadius: '9999px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div
        style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '14px',
          marginTop: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {formattedDueDate ? `Due ${formattedDueDate}` : 'No due date'}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => onEdit(todo)}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(todo.id)}
            className="btn-danger"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            Delete
          </button>

          <Link
            href={`/todo?id=${todo.id}`}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#60a5fa' }}
          >
            Details →
          </Link>
        </div>
      </div>
    </div>
  );
};
