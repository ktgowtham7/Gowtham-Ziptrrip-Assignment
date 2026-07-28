import React from 'react';
import { TodoSummaryStats } from '../types/todo';

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
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px',
        marginBottom: '20px',
      }}
    >
      <div className="card" style={{ padding: '16px 18px' }}>
        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px' }}>
          Total Tasks
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.total}</div>
      </div>

      <div className="card" style={{ padding: '16px 18px' }}>
        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px' }}>
          Completed
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>{stats.completed}</div>
        <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
          {completionRate}% rate
        </div>
      </div>

      <div className="card" style={{ padding: '16px 18px' }}>
        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px' }}>
          Active
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>
          {stats.pending + stats.inProgress}
        </div>
        <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
          {stats.inProgress} in progress, {stats.pending} pending
        </div>
      </div>

      <div className="card" style={{ padding: '16px 18px' }}>
        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px' }}>
          Overdue
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f43f5e' }}>{stats.overdue}</div>
      </div>
    </div>
  );
};
