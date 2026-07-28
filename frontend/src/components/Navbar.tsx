import React from 'react';
import Link from 'next/link';
import { useTheme } from '../pages/_app';

interface NavbarProps {
  onOpenCreateModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateModal }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      style={{
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-card)',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link href="/todos" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Ziptrrip Todo
          </span>
          <span
            style={{
              fontSize: '0.725rem',
              color: 'var(--text-subtle)',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid var(--border-color)',
              fontWeight: 500,
            }}
          >
            MPA
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/todos" className="btn-secondary">
            All Todos
          </Link>

          {onOpenCreateModal && (
            <button onClick={onOpenCreateModal} className="btn-primary">
              + New Todo
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>
    </header>
  );
};
