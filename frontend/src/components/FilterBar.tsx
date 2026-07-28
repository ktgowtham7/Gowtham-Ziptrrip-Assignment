import React from 'react';
import { TodoQueryParams, TodoStatus, TodoPriority } from '../types/todo';
import { Search, ArrowUpDown, X } from 'lucide-react';

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
    <div
      className="card"
      style={{
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
      }}
    >
      {/* Search Input */}
      <div style={{ flex: '1 1 240px', position: 'relative' }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
          }}
        />
        <input
          type="text"
          className="input-control"
          style={{ paddingLeft: '36px', paddingRight: '36px' }}
          placeholder="Search by title, description..."
          value={filters.search || ''}
          onChange={(e) => onChange({ search: e.target.value, page: 1 })}
        />
        {filters.search && (
          <button
            onClick={() => onChange({ search: '', page: 1 })}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Status Filter */}
      <div style={{ minWidth: '130px' }}>
        <select
          className="input-control"
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
      <div style={{ minWidth: '130px' }}>
        <select
          className="input-control"
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
        <div style={{ minWidth: '130px' }}>
          <select
            className="input-control"
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
      <div style={{ display: 'flex', gap: '6px', minWidth: '180px' }}>
        <select
          className="input-control"
          value={filters.sortBy || 'createdAt'}
          onChange={(e) => onChange({ sortBy: e.target.value as any })}
        >
          <option value="createdAt">Date Created</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>

        <button
          className="btn-secondary"
          style={{ padding: '8px 12px' }}
          onClick={() => onChange({ order: filters.order === 'asc' ? 'desc' : 'asc' })}
          title={`Order: ${filters.order === 'asc' ? 'Ascending' : 'Descending'}`}
        >
          <ArrowUpDown size={16} />
        </button>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="btn-secondary"
          style={{ padding: '8px 12px', fontSize: '0.8rem', color: 'var(--accent-rose)' }}
        >
          <X size={14} /> Clear
        </button>
      )}
    </div>
  );
};
