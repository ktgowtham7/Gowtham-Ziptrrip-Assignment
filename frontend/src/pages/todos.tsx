import { useState } from 'react';
import Head from 'next/head';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Navbar } from '../components/Navbar';
import { StatsSummary } from '../components/StatsSummary';
import { FilterBar } from '../components/FilterBar';
import { TodoCard } from '../components/TodoCard';
import { TodoFormModal } from '../components/TodoFormModal';
import { todoApi } from '../services/api';
import { CreateTodoInput, Todo, TodoQueryParams } from '../types/todo';

export default function TodosPage() {
  const queryClient = useQueryClient();
  
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

  const { data: todosData, isLoading: isLoadingTodos, error: todosError } = useQuery({
    queryKey: ['todos', filters],
    queryFn: () => todoApi.getTodos(filters),
  });

  const { data: statsData } = useQuery({
    queryKey: ['stats'],
    queryFn: () => todoApi.getSummaryStats(),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: 'pending' | 'in_progress' | 'completed' }) => todoApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => todoApi.deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Todo deleted successfully');
    },
    onError: () => toast.error('Failed to delete todo'),
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateTodoInput) => todoApi.createTodo(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Todo created successfully');
      setIsModalOpen(false);
    },
    onError: () => toast.error('Failed to create todo'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string, input: CreateTodoInput }) => todoApi.updateTodo(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Todo updated successfully');
      setIsModalOpen(false);
    },
    onError: () => toast.error('Failed to update todo'),
  });

  const handleFilterChange = (newFilters: Partial<TodoQueryParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: newFilters.page ?? 1 }));
  };

  const handleStatusToggle = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    toggleStatusMutation.mutate({ id, status: nextStatus });
  };

  const handleOpenCreateModal = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleDeleteTodo = (id: string) => {
    if (confirm('Are you sure you want to delete this todo item?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSubmit = (input: CreateTodoInput, editId?: string) => {
    if (editId) {
      updateMutation.mutate({ id: editId, input });
    } else {
      createMutation.mutate(input);
    }
  };

  const handleRefresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['todos'] }),
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    ]);
    toast.success('Data refreshed');
  };

  const todos = todosData?.data || [];
  const pagination = todosData?.pagination || { page: 1, totalPages: 1, total: 0, limit: 9 };
  const categories = statsData?.byCategory ? Object.keys(statsData.byCategory) : [];

  return (
    <>
      <Head>
        <title>Todo Application</title>
        <meta name="description" content="Manage your tasks effectively" />
      </Head>

      <div className="min-h-screen flex flex-col bg-background text-textMain">
        <Navbar onOpenCreateModal={handleOpenCreateModal} />

        <main className="max-w-7xl w-full mx-auto px-6 py-8 flex-1">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Todos Overview</h1>
              <p className="text-textMuted text-sm mt-1">Manage, filter, and track your tasks and subtasks.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleRefresh} className="btn-secondary transition-transform hover:scale-105 active:scale-95" title="Refresh list">
                Refresh
              </button>
              <button onClick={handleOpenCreateModal} className="btn-primary transition-transform hover:scale-105 active:scale-95">
                + New Todo
              </button>
            </div>
          </div>

          <StatsSummary stats={statsData || null} />

          <FilterBar filters={filters} onChange={handleFilterChange} categories={categories} />

          {todosError && (
            <div className="p-4 rounded-xl bg-rose-500/10 text-rose-500 mb-6 text-sm flex items-center gap-2">
              ⚠️ Could not connect to backend server.
            </div>
          )}

          {isLoadingTodos ? (
            <div className="py-16 text-center text-textMuted flex flex-col items-center justify-center space-y-4">
              <div className="spin rounded-full h-8 w-8 border-b-2 border-accent-blue"></div>
              <p>Loading your tasks...</p>
            </div>
          ) : todos.length === 0 ? (
            <div className="card p-16 text-center shadow-lg rounded-2xl flex flex-col items-center">
              <div className="w-20 h-20 bg-cardHover rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-textMuted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No Todos Found</h3>
              <p className="text-textMuted text-sm mb-6 max-w-sm">No task matched your search filter criteria or your database is empty. Get started by creating one!</p>
              <button onClick={handleOpenCreateModal} className="btn-primary">
                + Create Your First Todo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                disabled={pagination.page <= 1}
                onClick={() => handleFilterChange({ page: pagination.page - 1 })}
                className="btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-textMuted font-medium bg-card px-4 py-2 rounded-full border border-borderBase shadow-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handleFilterChange({ page: pagination.page + 1 })}
                className="btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </main>

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
