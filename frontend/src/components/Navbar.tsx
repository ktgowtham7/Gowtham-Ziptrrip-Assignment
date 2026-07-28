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
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-card)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link href="/todos">
          <span style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
            Todo
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/todos" className="btn-secondary" style={{ fontSize: '0.825rem' }}>
            Todos
          </Link>

          {onOpenCreateModal && (
            <button onClick={onOpenCreateModal} className="btn-primary" style={{ fontSize: '0.825rem' }}>
              + New Todo
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="btn-secondary"
            style={{ fontSize: '0.775rem', padding: '6px 12px' }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>
    </header>
  );
};
