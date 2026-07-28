import React from 'react';
import Link from 'next/link';
import { useTheme } from '../pages/_app';
import { Sun, Moon, CheckSquare, ListTodo, Plus } from 'lucide-react';

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
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link href="/todos" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <CheckSquare size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Ziptrrip <span style={{ color: 'var(--accent-primary)' }}>Todo</span>
            </span>
            <span
              style={{
                display: 'block',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                fontWeight: 500,
              }}
            >
              Multi-Page Application (MPA)
            </span>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/todos" className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
            <ListTodo size={16} /> All Todos
          </Link>

          {onOpenCreateModal && (
            <button onClick={onOpenCreateModal} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              <Plus size={16} /> New Todo
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="btn-secondary"
            style={{
              padding: '8px',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#3b82f6" />}
          </button>
        </div>
      </div>
    </header>
  );
};
