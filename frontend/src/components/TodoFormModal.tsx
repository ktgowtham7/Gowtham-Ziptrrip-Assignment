import React, { useState, useEffect } from 'react';
import { CreateTodoInput, Todo, TodoPriority, TodoStatus } from '../types/todo';
import { X, Plus, Trash2 } from 'lucide-react';

interface TodoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateTodoInput, editId?: string) => Promise<void>;
  initialTodo?: Todo | null;
}

export const TodoFormModal: React.FC<TodoFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTodo,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TodoStatus>('pending');
  const [priority, setPriority] = useState<TodoPriority>('medium');
  const [category, setCategory] = useState('Work');
  const [dueDate, setDueDate] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [subtasks, setSubtasks] = useState<Array<{ title: string; completed: boolean }>>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTodo) {
      setTitle(initialTodo.title);
      setDescription(initialTodo.description || '');
      setStatus(initialTodo.status);
      setPriority(initialTodo.priority);
      setCategory(initialTodo.category || 'Work');
      setDueDate(initialTodo.dueDate ? initialTodo.dueDate.split('T')[0] : '');
      setTagsInput(initialTodo.tags ? initialTodo.tags.join(', ') : '');
      setSubtasks(initialTodo.subtasks ? initialTodo.subtasks.map((s) => ({ title: s.title, completed: s.completed })) : []);
    } else {
      setTitle('');
      setDescription('');
      setStatus('pending');
      setPriority('medium');
      setCategory('Work');
      setDueDate('');
      setTagsInput('');
      setSubtasks([]);
    }
    setError('');
  }, [initialTodo, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      setSubtasks([...subtasks, { title: newSubtaskTitle.trim(), completed: false }]);
      setNewSubtaskTitle('');
    }
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const formattedDueDate = dueDate ? new Date(dueDate).toISOString() : null;

      await onSubmit(
        {
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          category: category.trim() || 'General',
          dueDate: formattedDueDate,
          tags,
          subtasks,
        },
        initialTodo?.id
      );

      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to save todo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {initialTodo ? 'Edit Todo Item' : 'Create New Todo'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Title *</label>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. Complete Ziptrrip API Integration"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Description</label>
            <textarea
              className="input-control"
              rows={3}
              placeholder="Add extra details, requirements, links..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Status</label>
              <select className="input-control" value={status} onChange={(e) => setStatus(e.target.value as TodoStatus)}>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Priority</label>
              <select className="input-control" value={priority} onChange={(e) => setPriority(e.target.value as TodoPriority)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Category</label>
              <input
                type="text"
                className="input-control"
                placeholder="Work, Personal, Design..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Due Date</label>
              <input
                type="date"
                className="input-control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Tags (comma-separated)</label>
            <input
              type="text"
              className="input-control"
              placeholder="api, urgent, backend"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          {!initialTodo && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Subtasks Checklist</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  className="input-control"
                  placeholder="Add a subtask step..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                />
                <button type="button" onClick={handleAddSubtask} className="btn-secondary" style={{ padding: '8px 12px' }}>
                  <Plus size={16} />
                </button>
              </div>

              {subtasks.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                  {subtasks.map((st, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: 'var(--bg-input)', borderRadius: '6px', fontSize: '0.85rem' }}>
                      <span>• {st.title}</span>
                      <button type="button" onClick={() => handleRemoveSubtask(idx)} style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : initialTodo ? 'Update Todo' : 'Create Todo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
