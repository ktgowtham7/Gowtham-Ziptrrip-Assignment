import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';
import { TodoFormModal } from '../components/TodoFormModal';
import { todoApi } from '../services/api';
import { Todo, SubTask, CreateTodoInput } from '../types/todo';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Tag,
  Plus,
  Trash2,
  Edit2,
  CheckSquare,
  AlertCircle,
} from 'lucide-react';

export default function SingleTodoPage() {
  const router = useRouter();
  const { id } = router.query;

  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchTodoDetails = useCallback(async () => {
    if (!id || typeof id !== 'string') return;

    setLoading(true);
    setError('');
    try {
      const data = await todoApi.getTodoById(id);
      setTodo(data);
    } catch (err: any) {
      console.error('Failed to load todo details:', err);
      setError(err.response?.data?.error || `Todo item with ID '${id}' was not found.`);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (router.isReady) {
      if (!id) {
        setError('No Todo ID query parameter provided. Expected URL format: /todo?id=<todo_id>');
        setLoading(false);
      } else {
        fetchTodoDetails();
      }
    }
  }, [router.isReady, id, fetchTodoDetails]);

  const handleStatusToggle = async () => {
    if (!todo) return;
    const nextStatus = todo.status === 'completed' ? 'pending' : 'completed';
    try {
      const updated = await todoApi.updateStatus(todo.id, nextStatus);
      setTodo(updated);
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todo || !newSubtaskTitle.trim()) return;

    try {
      await todoApi.addSubtask(todo.id, newSubtaskTitle.trim());
      setNewSubtaskTitle('');
      fetchTodoDetails();
    } catch (err) {
      console.error('Failed to add subtask:', err);
    }
  };

  const handleToggleSubtask = async (subtaskId: string, currentCompleted: boolean) => {
    try {
      await todoApi.updateSubtask(subtaskId, undefined, !currentCompleted);
      fetchTodoDetails();
    } catch (err) {
      console.error('Failed to update subtask:', err);
    }
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    try {
      await todoApi.deleteSubtask(subtaskId);
      fetchTodoDetails();
    } catch (err) {
      console.error('Failed to delete subtask:', err);
    }
  };

  const handleDeleteTodo = async () => {
    if (!todo) return;
    if (confirm('Are you sure you want to delete this todo item permanently?')) {
      try {
        await todoApi.deleteTodo(todo.id);
        router.push('/todos');
      } catch (err) {
        console.error('Failed to delete todo:', err);
      }
    }
  };

  const handleFormSubmit = async (input: CreateTodoInput, editId?: string) => {
    if (editId) {
      await todoApi.updateTodo(editId, input);
      fetchTodoDetails();
    }
  };

  const completedSubtasks = todo?.subtasks?.filter((st) => st.completed).length || 0;
  const totalSubtasks = todo?.subtasks?.length || 0;
  const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <>
      <Head>
        <title>{todo ? `${todo.title} - Ziptrrip Todo` : 'Single Todo Detail Page'}</title>
        <meta name="description" content="Single Todo Item Details Page with query parameter ID support" />
      </Head>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />

        <main style={{ maxWidth: '900px', width: '100%', margin: '0 auto', padding: '32px 24px', flex: 1 }}>
          {/* Back button */}
          <div style={{ marginBottom: '24px' }}>
            <Link href="/todos" className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
              <ArrowLeft size={16} /> Back to All Todos
            </Link>
          </div>

          {loading ? (
            <div className="glass-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading todo item details...
            </div>
          ) : error || !todo ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
              <AlertCircle size={48} color="#f43f5e" style={{ marginBottom: '16px' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Todo Not Found</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>{error}</p>
              <Link href="/todos" className="btn-primary">
                Return to Dashboard
              </Link>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '32px' }}>
              {/* Header Details */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className={`badge badge-${todo.status}`}>
                    {todo.status.replace('_', ' ')}
                  </span>
                  <span className={`badge badge-priority-${todo.priority}`}>
                    {todo.priority} Priority
                  </span>
                  <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px', background: 'var(--bg-input)', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {todo.category}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setIsEditModalOpen(true)} className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
                    <Edit2 size={15} /> Edit
                  </button>
                  <button onClick={handleDeleteTodo} className="btn-danger" style={{ fontSize: '0.85rem' }}>
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
              </div>

              {/* Title & Status Toggle */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
                <button
                  onClick={handleStatusToggle}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: todo.status === 'completed' ? '#10b981' : 'var(--text-muted)',
                    marginTop: '4px',
                  }}
                  title="Toggle status"
                >
                  {todo.status === 'completed' ? <CheckCircle2 size={32} color="#10b981" /> : <Circle size={32} />}
                </button>
                <div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.3, textDecoration: todo.status === 'completed' ? 'line-through' : 'none' }}>
                    {todo.title}
                  </h1>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Query Parameter ID: <code style={{ background: 'var(--bg-input)', padding: '2px 6px', borderRadius: '4px' }}>{todo.id}</code>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '20px 0', margin: '20px 0' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  Description
                </h3>
                <p style={{ fontSize: '1rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', color: todo.description ? 'var(--text-main)' : 'var(--text-muted)' }}>
                  {todo.description || 'No description provided for this todo.'}
                </p>
              </div>

              {/* Metadata Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'var(--bg-input)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Created At</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} /> {new Date(todo.createdAt).toLocaleString()}
                  </div>
                </div>

                <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'var(--bg-input)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Last Updated</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} /> {new Date(todo.updatedAt).toLocaleString()}
                  </div>
                </div>

                <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'var(--bg-input)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Target Due Date</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', color: todo.dueDate ? 'var(--accent-blue)' : 'var(--text-muted)' }}>
                    <Calendar size={14} /> {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : 'None'}
                  </div>
                </div>
              </div>

              {/* Tags */}
              {todo.tags && todo.tags.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                    Associated Tags
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {todo.tags.map((tag) => (
                      <span key={tag} style={{ fontSize: '0.8rem', padding: '4px 12px', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Tag size={12} /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Subtasks Management */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    Subtasks ({completedSubtasks}/{totalSubtasks})
                  </h3>
                  {totalSubtasks > 0 && (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {subtaskProgress}% Completed
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                {totalSubtasks > 0 && (
                  <div style={{ height: '8px', width: '100%', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
                    <div style={{ height: '100%', width: `${subtaskProgress}%`, background: subtaskProgress === 100 ? '#10b981' : '#3b82f6', transition: 'width 0.3s ease' }} />
                  </div>
                )}

                {/* Add Subtask Form */}
                <form onSubmit={handleAddSubtask} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <input
                    type="text"
                    className="input-control"
                    placeholder="Add a new subtask step..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '8px 16px', whiteSpace: 'nowrap' }}>
                    <Plus size={16} /> Add Subtask
                  </button>
                </form>

                {/* Subtasks List */}
                {totalSubtasks === 0 ? (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '12px 0' }}>
                    No subtasks added yet. Use the field above to break down this task.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {todo.subtasks?.map((st) => (
                      <div
                        key={st.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          borderRadius: '10px',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        <div
                          onClick={() => handleToggleSubtask(st.id, st.completed)}
                          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}
                        >
                          {st.completed ? <CheckCircle2 size={20} color="#10b981" /> : <Circle size={20} color="var(--text-muted)" />}
                          <span style={{ fontSize: '0.95rem', textDecoration: st.completed ? 'line-through' : 'none', color: st.completed ? 'var(--text-muted)' : 'var(--text-main)' }}>
                            {st.title}
                          </span>
                        </div>

                        <button
                          onClick={() => handleDeleteSubtask(st.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', padding: '4px' }}
                          title="Delete subtask"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Edit Modal */}
        <TodoFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleFormSubmit}
          initialTodo={todo}
        />
      </div>
    </>
  );
}
