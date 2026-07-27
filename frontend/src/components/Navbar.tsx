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
    <header style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
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
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            }}
          >
            <CheckSquare size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Ziptrrip<span style={{ color: 'var(--accent-blue)' }}>Todo</span>
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
            <button onClick={onOpenCreateModal} className="btn-primary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
              <Plus size={16} /> New Todo
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="btn-secondary"
            style={{ padding: '8px', borderRadius: '50%' }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#3b82f6" />}
          </button>
        </div>
      </div>
    </header>
  );
};
