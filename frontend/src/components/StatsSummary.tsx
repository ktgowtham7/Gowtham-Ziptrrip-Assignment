import React from 'react';
import { TodoSummaryStats } from '../types/todo';

interface StatsSummaryProps {
  stats: TodoSummaryStats | null;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ stats }) => {
  if (!stats) return null;

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div style={{ marginBottom: '28px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
        }}
      >
        {/* Total Todos Card */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Total Tasks
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{stats.total}</div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 500 }}>
            All registered items
          </div>
        </div>

        {/* Completed Card */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Completed
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', letterSpacing: '-0.03em' }}>{stats.completed}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <div style={{ flex: 1, height: '4px', background: 'var(--bg-input)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${completionRate}%`,
                  height: '100%',
                  background: '#34d399',
                  borderRadius: '9999px',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>{completionRate}%</span>
          </div>
        </div>

        {/* Active Card */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Active Tasks
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#60a5fa', letterSpacing: '-0.03em' }}>
            {stats.pending + stats.inProgress}
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 500 }}>
            {stats.inProgress} in progress, {stats.pending} pending
          </div>
        </div>

        {/* Overdue Card */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Overdue
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fb7185', letterSpacing: '-0.03em' }}>{stats.overdue}</div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 500 }}>
            Past target deadline
          </div>
        </div>
      </div>
    </div>
  );
};
