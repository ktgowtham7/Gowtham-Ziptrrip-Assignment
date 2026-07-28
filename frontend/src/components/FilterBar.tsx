import React from 'react';
import { TodoQueryParams, TodoStatus, TodoPriority } from '../types/todo';

interface FilterBarProps {
  filters: TodoQueryParams;
  onChange: (newFilters: Partial<TodoQueryParams>) => void;
  categories: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange, categories }) => {
  const hasActiveFilters = Boolean(
    filters.search || filters.status || filters.priority || filters.category
  );

  const clearFilters = () => {
    onChange({
      search: '',
      status: undefined,
      priority: undefined,
      category: undefined,
      page: 1,
    });
  };

  return (
    <div className="card px-5 py-4 mb-8 flex flex-wrap gap-4 items-center bg-card border border-borderBase shadow-sm rounded-xl">
      {/* Search Input */}
      <div className="flex-[1_1_260px]">
        <input
          type="text"
          className="input-control w-full"
          placeholder="Filter tasks by title, description..."
          value={filters.search || ''}
          onChange={(e) => onChange({ search: e.target.value, page: 1 })}
        />
      </div>

      {/* Status Filter */}
      <div className="min-w-[140px]">
        <select
          className="input-control w-full"
          value={filters.status || ''}
          onChange={(e) => onChange({ status: (e.target.value as TodoStatus) || undefined, page: 1 })}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Priority Filter */}
      <div className="min-w-[140px]">
        <select
          className="input-control w-full"
          value={filters.priority || ''}
          onChange={(e) => onChange({ priority: (e.target.value as TodoPriority) || undefined, page: 1 })}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="min-w-[140px]">
          <select
            className="input-control w-full"
            value={filters.category || ''}
            onChange={(e) => onChange({ category: e.target.value || undefined, page: 1 })}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Sort Field & Order */}
      <div className="flex gap-2 min-w-[180px]">
        <select
          className="input-control w-full"
          value={filters.sortBy || 'createdAt'}
          onChange={(e) => onChange({ sortBy: e.target.value as any })}
        >
          <option value="createdAt">Date Created</option>
          <option value="dueDate">Due Target</option>
          <option value="priority">Priority Level</option>
          <option value="title">Title A-Z</option>
        </select>

        <button
          className="btn-secondary px-3 py-2 flex items-center justify-center font-bold"
          onClick={() => onChange({ order: filters.order === 'asc' ? 'desc' : 'asc' })}
          title={`Order: ${filters.order === 'asc' ? 'Ascending' : 'Descending'}`}
        >
          {filters.order === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="btn-secondary text-rose-500 border-rose-500/30 hover:bg-rose-500/10 px-3 py-2 text-sm"
        >
          Reset
        </button>
      )}
    </div>
  );
};
