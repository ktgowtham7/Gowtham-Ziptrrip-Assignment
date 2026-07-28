import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { TodoFormModal } from '../components/TodoFormModal';
import { todoApi } from '../services/api';
import { Todo, CreateTodoInput } from '../types/todo';
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
  AlertCircle,
} from 'lucide-react';

export default function SingleTodoPage() {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: todo, isLoading: loading, error } = useQuery({
    queryKey: ['todo', id],
    queryFn: () => todoApi.getTodoById(id as string),
    enabled: !!id && typeof id === 'string',
    retry: false,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (status: 'pending' | 'in_progress' | 'completed') => todoApi.updateStatus(id as string, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo', id] });
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });

  const addSubtaskMutation = useMutation({
    mutationFn: (title: string) => todoApi.addSubtask(id as string, title),
    onSuccess: () => {
      setNewSubtaskTitle('');
      queryClient.invalidateQueries({ queryKey: ['todo', id] });
      toast.success('Subtask added');
    },
    onError: () => toast.error('Failed to add subtask'),
  });

  const toggleSubtaskMutation = useMutation({
    mutationFn: ({ subtaskId, completed }: { subtaskId: string, completed: boolean }) => 
      todoApi.updateSubtask(subtaskId, undefined, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo', id] });
    },
    onError: () => toast.error('Failed to update subtask'),
  });

  const deleteSubtaskMutation = useMutation({
    mutationFn: (subtaskId: string) => todoApi.deleteSubtask(subtaskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo', id] });
      toast.success('Subtask deleted');
    },
    onError: () => toast.error('Failed to delete subtask'),
  });

  const deleteTodoMutation = useMutation({
    mutationFn: () => todoApi.deleteTodo(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Todo deleted');
      router.push('/todos');
    },
    onError: () => toast.error('Failed to delete todo'),
  });

  const updateTodoMutation = useMutation({
    mutationFn: (input: CreateTodoInput) => todoApi.updateTodo(id as string, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo', id] });
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Todo updated');
      setIsEditModalOpen(false);
    },
    onError: () => toast.error('Failed to update todo'),
  });

  const handleStatusToggle = () => {
    if (!todo) return;
    const nextStatus = todo.status === 'completed' ? 'pending' : 'completed';
    toggleStatusMutation.mutate(nextStatus);
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      addSubtaskMutation.mutate(newSubtaskTitle.trim());
    }
  };

  const handleDeleteTodo = () => {
    if (confirm('Are you sure you want to delete this todo item permanently?')) {
      deleteTodoMutation.mutate();
    }
  };

  const handleFormSubmit = async (input: CreateTodoInput, editId?: string) => {
    if (editId) {
      updateTodoMutation.mutate(input);
    }
  };

  const completedSubtasks = todo?.subtasks?.filter((st) => st.completed).length || 0;
  const totalSubtasks = todo?.subtasks?.length || 0;
  const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <>
      <Head>
        <title>{todo ? `${todo.title} - Ziptrrip Todo` : 'Single Todo Detail Page'}</title>
        <meta name="description" content="Single Todo Item Details Page" />
      </Head>

      <div className="min-h-screen flex flex-col bg-background text-textMain">
        <Navbar />

        <main className="max-w-4xl w-full mx-auto px-6 py-8 flex-1">
          <div className="mb-6">
            <Link href="/todos" className="btn-secondary px-4 py-2 text-sm inline-flex items-center gap-2 hover:bg-cardHover">
              <ArrowLeft size={16} /> Back to All Todos
            </Link>
          </div>

          {!router.isReady ? null : !id ? (
            <div className="card p-10 text-center text-rose-500 bg-rose-500/10 rounded-xl">
              <AlertCircle size={48} className="mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Invalid URL</h2>
              <p className="text-sm">No Todo ID query parameter provided.</p>
              <Link href="/todos" className="btn-primary mt-6 inline-flex">
                Return to Dashboard
              </Link>
            </div>
          ) : loading ? (
            <div className="py-20 text-center text-textMuted flex flex-col items-center justify-center space-y-4">
              <div className="spin rounded-full h-8 w-8 border-b-2 border-accent-blue"></div>
              <p>Loading todo item details...</p>
            </div>
          ) : error || !todo ? (
            <div className="card p-10 text-center bg-card rounded-xl">
              <AlertCircle size={48} className="mx-auto mb-4 text-rose-500" />
              <h2 className="text-xl font-bold mb-2">Todo Not Found</h2>
              <p className="text-sm text-textMuted mb-6">The requested todo could not be loaded.</p>
              <Link href="/todos" className="btn-primary inline-flex">
                Return to Dashboard
              </Link>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-8 bg-card rounded-2xl shadow-sm border border-borderBase">
              <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
                <div className="flex gap-2 items-center">
                  <span className={`badge badge-${todo.status}`}>
                    {todo.status.replace('_', ' ')}
                  </span>
                  <span className={`badge badge-priority-${todo.priority}`}>
                    {todo.priority} Priority
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-md bg-input text-textMuted font-semibold border border-borderBase">
                    {todo.category}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setIsEditModalOpen(true)} className="btn-secondary px-3 py-2 text-sm flex items-center gap-1.5 hover:bg-cardHover">
                    <Edit2 size={15} /> Edit
                  </button>
                  <button onClick={handleDeleteTodo} className="btn-danger px-3 py-2 text-sm flex items-center gap-1.5 hover:bg-rose-500/20">
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-8">
                <button
                  onClick={handleStatusToggle}
                  className={`mt-1.5 transition-colors ${todo.status === 'completed' ? 'text-emerald-500' : 'text-textMuted hover:text-emerald-400'}`}
                  title="Toggle status"
                >
                  {todo.status === 'completed' ? <CheckCircle2 size={32} /> : <Circle size={32} />}
                </button>
                <div>
                  <h1 className={`text-3xl font-extrabold leading-tight ${todo.status === 'completed' ? 'line-through text-textMuted' : ''}`}>
                    {todo.title}
                  </h1>
                  <div className="text-xs text-textMuted mt-2 font-mono bg-input px-2 py-1 rounded inline-block border border-borderBase">
                    ID: {todo.id}
                  </div>
                </div>
              </div>

              <div className="border-y border-borderBase py-6 my-6">
                <h3 className="text-sm text-textMuted font-bold uppercase tracking-wider mb-3">
                  Description
                </h3>
                <p className={`text-base leading-relaxed whitespace-pre-wrap ${todo.description ? 'text-textMain' : 'text-textMuted italic'}`}>
                  {todo.description || 'No description provided for this todo.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-input border border-borderBase">
                  <span className="text-xs text-textMuted block mb-1 font-semibold">Created At</span>
                  <div className="text-sm font-bold flex items-center gap-2">
                    <Clock size={14} className="text-textMuted" /> {new Date(todo.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-input border border-borderBase">
                  <span className="text-xs text-textMuted block mb-1 font-semibold">Last Updated</span>
                  <div className="text-sm font-bold flex items-center gap-2">
                    <Clock size={14} className="text-textMuted" /> {new Date(todo.updatedAt).toLocaleString()}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-input border border-borderBase">
                  <span className="text-xs text-textMuted block mb-1 font-semibold">Target Due Date</span>
                  <div className={`text-sm font-bold flex items-center gap-2 ${todo.dueDate ? 'text-blue-400' : 'text-textMuted'}`}>
                    <Calendar size={14} /> {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : 'None'}
                  </div>
                </div>
              </div>

              {todo.tags && todo.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm text-textMuted font-bold uppercase tracking-wider mb-3">
                    Associated Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {todo.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 font-semibold inline-flex items-center gap-1.5 border border-blue-500/20">
                        <Tag size={12} /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-borderBase pt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">
                    Subtasks <span className="text-textMuted text-lg font-medium ml-1">({completedSubtasks}/{totalSubtasks})</span>
                  </h3>
                  {totalSubtasks > 0 && (
                    <span className="text-sm text-textMuted font-bold">
                      {subtaskProgress}% Completed
                    </span>
                  )}
                </div>

                {totalSubtasks > 0 && (
                  <div className="h-2 w-full bg-input rounded-full overflow-hidden mb-6 shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${subtaskProgress}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className={`h-full rounded-full ${subtaskProgress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    />
                  </div>
                )}

                <form onSubmit={handleAddSubtask} className="flex gap-3 mb-6">
                  <input
                    type="text"
                    className="input-control flex-1"
                    placeholder="Add a new subtask step..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  />
                  <button type="submit" className="btn-primary px-5 whitespace-nowrap shadow-md" disabled={addSubtaskMutation.isPending}>
                    <Plus size={16} /> Add
                  </button>
                </form>

                {totalSubtasks === 0 ? (
                  <div className="text-sm text-textMuted italic p-4 text-center bg-input/50 rounded-xl border border-borderBase border-dashed">
                    No subtasks added yet. Use the field above to break down this task.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {todo.subtasks?.map((st) => (
                      <div
                        key={st.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-input border border-borderBase hover:border-borderHover transition-colors group shadow-sm"
                      >
                        <button
                          onClick={() => toggleSubtaskMutation.mutate({ subtaskId: st.id, completed: !st.completed })}
                          className="flex items-center gap-3 flex-1 text-left"
                        >
                          {st.completed ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Circle size={20} className="text-textMuted group-hover:text-blue-400 transition-colors" />}
                          <span className={`text-sm font-medium transition-colors ${st.completed ? 'line-through text-textMuted' : 'text-textMain'}`}>
                            {st.title}
                          </span>
                        </button>

                        <button
                          onClick={() => deleteSubtaskMutation.mutate(st.id)}
                          className="text-textMuted hover:text-rose-500 p-2 rounded-lg hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Delete subtask"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </main>

        {todo && (
          <TodoFormModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSubmit={handleFormSubmit}
            initialTodo={todo}
          />
        )}
      </div>
    </>
  );
}

