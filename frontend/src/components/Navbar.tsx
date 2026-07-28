import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from '../pages/_app';

interface NavbarProps {
  onOpenCreateModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateModal }) => {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const isTodosActive = router.pathname === '/todos' || router.pathname === '/';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-card)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '14px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo & Title */}
        <Link href="/todos" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '7px',
              background: 'var(--text-main)',
              color: 'var(--bg-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.85rem',
            }}
          >
            T
          </div>
          <span style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
            Todo
          </span>
        </Link>

        {/* Right Navigation & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link
            href="/todos"
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '6px 14px',
              borderRadius: '6px',
              background: isTodosActive ? 'var(--bg-input)' : 'transparent',
              color: isTodosActive ? 'var(--text-main)' : 'var(--text-muted)',
              border: isTodosActive ? '1px solid var(--border-color)' : '1px solid transparent',
              transition: 'all 0.15s ease',
            }}
          >
            Overview
          </Link>

          {onOpenCreateModal && (
            <button onClick={onOpenCreateModal} className="btn-primary" style={{ padding: '7px 15px', fontSize: '0.825rem' }}>
              + New Task
            </button>
          )}

          <div
            style={{
              width: '1px',
              height: '20px',
              background: 'var(--border-color)',
              margin: '0 2px',
            }}
          />

          <button
            onClick={toggleTheme}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? '☀ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>
    </header>
  );
};
