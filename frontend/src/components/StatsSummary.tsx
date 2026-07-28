import React from 'react';
import { TodoSummaryStats } from '../types/todo';
import { CheckCircle2, Clock, AlertTriangle, ListTodo } from 'lucide-react';

interface StatsSummaryProps {
  stats: TodoSummaryStats | null;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ stats }) => {
  if (!stats) return null;

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}
    >
      {/* Total Todos Card */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total Tasks</span>
          <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <ListTodo size={18} />
          </div>
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{stats.total}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>All todos in database</div>
      </div>

      {/* Completed Card */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Completed</span>
          <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <CheckCircle2 size={18} />
          </div>
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#10b981' }}>{stats.completed}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          {completionRate}% completion rate
        </div>
      </div>

      {/* Active Card */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Active Tasks</span>
          <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Clock size={18} />
          </div>
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f59e0b' }}>
          {stats.pending + stats.inProgress}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          {stats.inProgress} in progress, {stats.pending} pending
        </div>
      </div>

      {/* Overdue Card */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Overdue</span>
          <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' }}>
            <AlertTriangle size={18} />
          </div>
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f43f5e' }}>{stats.overdue}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Past target due date</div>
      </div>
    </div>
  );
};
