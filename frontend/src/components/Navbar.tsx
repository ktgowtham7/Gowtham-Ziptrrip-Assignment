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
        <Link href="/todos" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.9rem',
            }}
          >
            ✓
          </div>
          <div>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Ziptrrip Todo
            </span>
            <span
              style={{
                marginLeft: '8px',
                fontSize: '0.7rem',
                color: 'var(--text-subtle)',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                fontWeight: 500,
              }}
            >
              MPA
            </span>
          </div>
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
            {theme === 'dark' ? '☀ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>
    </header>
  );
};
