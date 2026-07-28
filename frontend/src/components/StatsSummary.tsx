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
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        marginBottom: '24px',
      }}
    >
      <div className="card" style={{ padding: '18px 20px' }}>
        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '6px' }}>
          Total Tasks
        </div>
        <div style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>{stats.total}</div>
        <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)', marginTop: '4px' }}>Registered todos</div>
      </div>

      <div className="card" style={{ padding: '18px 20px' }}>
        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '6px' }}>
          Completed
        </div>
        <div style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>{stats.completed}</div>
        <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
          {completionRate}% complete
        </div>
      </div>

      <div className="card" style={{ padding: '18px 20px' }}>
        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '6px' }}>
          Active
        </div>
        <div style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
          {stats.pending + stats.inProgress}
        </div>
        <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
          {stats.inProgress} in progress, {stats.pending} pending
        </div>
      </div>

      <div className="card" style={{ padding: '18px 20px' }}>
        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '6px' }}>
          Overdue
        </div>
        <div style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>{stats.overdue}</div>
        <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)', marginTop: '4px' }}>Past due date</div>
      </div>
    </div>
  );
};
