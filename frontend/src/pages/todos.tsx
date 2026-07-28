import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { Navbar } from '../components/Navbar';
import { StatsSummary } from '../components/StatsSummary';
import { FilterBar } from '../components/FilterBar';
import { TodoCard } from '../components/TodoCard';
import { TodoFormModal } from '../components/TodoFormModal';
import { todoApi } from '../services/api';
import { CreateTodoInput, Todo, TodoQueryParams, TodoSummaryStats } from '../types/todo';

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [stats, setStats] = useState<TodoSummaryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 9,
  });

  const [filters, setFilters] = useState<TodoQueryParams>({
    search: '',
    status: '',
    priority: '',
    category: '',
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 9,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await todoApi.getTodos(filters);
      setTodos(res.data);
      setPagination(res.pagination);

      // Fetch Stats
      const statsRes = await todoApi.getSummaryStats();
      setStats(statsRes);
      if (statsRes.byCategory) {
        setCategories(Object.keys(statsRes.byCategory));
      }
    } catch (err: any) {
      console.error('Failed to fetch todos:', err);
      setError('Could not connect to backend server. Make sure backend is running on http://localhost:5000');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleFilterChange = (newFilters: Partial<TodoQueryParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      await todoApi.updateStatus(id, nextStatus);
      fetchTodos();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleDeleteTodo = async (id: string) => {
    if (confirm('Are you sure you want to delete this todo item?')) {
      try {
        await todoApi.deleteTodo(id);
        fetchTodos();
      } catch (err) {
        console.error('Failed to delete todo:', err);
      }
    }
  };

  const handleFormSubmit = async (input: CreateTodoInput, editId?: string) => {
    if (editId) {
      await todoApi.updateTodo(editId, input);
    } else {
      await todoApi.createTodo(input);
    }
    fetchTodos();
  };

  return (
    <>
      <Head>
        <title>Todo Application</title>
        <meta name="description" content="Todo Application" />
      </Head>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar onOpenCreateModal={handleOpenCreateModal} />

        <main style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '32px 24px', flex: 1 }}>
          {/* Header Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Todos Overview
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                Manage, filter, and track your tasks and subtasks.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => fetchTodos()} className="btn-secondary" title="Refresh list">
                Refresh
              </button>
              <button onClick={handleOpenCreateModal} className="btn-primary">
                + New Todo
              </button>
            </div>
          </div>

          {/* Stats Summary Banner */}
          <StatsSummary stats={stats} />

          {/* Search and Filters */}
          <FilterBar filters={filters} onChange={handleFilterChange} categories={categories} />

          {/* Error Notice */}
          {error && (
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', marginBottom: '24px', fontSize: '0.9rem' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Todo Cards Grid */}
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div>Loading todos...</div>
            </div>
          ) : todos.length === 0 ? (
            <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px' }}>No Todos Found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                No task matched your search filter criteria or database is empty.
              </p>
              <button onClick={handleOpenCreateModal} className="btn-primary">
                + Create Your First Todo
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              {todos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onStatusToggle={handleStatusToggle}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteTodo}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '24px' }}>
              <button
                disabled={pagination.page <= 1}
                onClick={() => handleFilterChange({ page: pagination.page - 1 })}
                className="btn-secondary"
                style={{ padding: '8px 14px', opacity: pagination.page <= 1 ? 0.5 : 1 }}
              >
                Previous
              </button>

              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handleFilterChange({ page: pagination.page + 1 })}
                className="btn-secondary"
                style={{ padding: '8px 14px', opacity: pagination.page >= pagination.totalPages ? 0.5 : 1 }}
              >
                Next
              </button>
            </div>
          )}
        </main>

        {/* Modal for Create/Edit */}
        <TodoFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
          initialTodo={editingTodo}
        />
      </div>
    </>
  );
}
