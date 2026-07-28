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
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        opacity: isCompleted ? 0.75 : 1,
      }}
    >
      <div>
        {/* Top Header Row: Status, Priority & Category */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={() => onStatusToggle(todo.id, todo.status)}
              style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#10b981' }}
              title={`Mark as ${isCompleted ? 'Pending' : 'Completed'}`}
            />
            <span className={`badge badge-${todo.status}`}>
              {todo.status.replace('_', ' ')}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span className={`badge badge-priority-${todo.priority}`}>
              {todo.priority}
            </span>
            <span
              style={{
                fontSize: '0.725rem',
                padding: '2px 7px',
                borderRadius: '4px',
                background: 'var(--bg-input)',
                color: 'var(--text-muted)',
                fontWeight: 500,
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
              fontSize: '1.05rem',
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
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              marginBottom: '12px',
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
            {todo.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '0.7rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'var(--bg-input)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-color)',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Subtask Progress */}
        {totalSubtasks > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Subtasks</span>
              <span>{completedSubtasks}/{totalSubtasks} ({subtaskProgress}%)</span>
            </div>
            <div style={{ height: '4px', width: '100%', background: 'var(--bg-input)', borderRadius: '2px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${subtaskProgress}%`,
                  background: subtaskProgress === 100 ? '#10b981' : '#3b82f6',
                  transition: 'width 0.2s ease',
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
          paddingTop: '10px',
          marginTop: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {formattedDueDate ? `Due ${formattedDueDate}` : 'No due date'}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => onEdit(todo)}
            className="btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.775rem' }}
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(todo.id)}
            className="btn-danger"
            style={{ padding: '4px 10px', fontSize: '0.775rem' }}
          >
            Delete
          </button>

          <Link
            href={`/todo?id=${todo.id}`}
            className="btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.775rem', color: 'var(--accent-blue)' }}
          >
            Details →
          </Link>
        </div>
      </div>
    </div>
  );
};
