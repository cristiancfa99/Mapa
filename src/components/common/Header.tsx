import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  right?: React.ReactNode;
  transparent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showBack, right, transparent }) => {
  const navigate = useNavigate();

  return (
    <header style={{
      display: 'flex', alignItems: 'center',
      height: 'var(--header-h)', padding: '0 8px',
      background: transparent ? 'transparent' : 'var(--surface)',
      borderBottom: transparent ? 'none' : '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      {showBack ? (
        <button
          onClick={() => navigate(-1)}
          style={{
            width: 40, height: 40, display: 'flex', alignItems: 'center',
            justifyContent: 'center', border: 'none', background: 'transparent',
            cursor: 'pointer', color: 'var(--primary)', borderRadius: 10,
            flexShrink: 0,
          }}
        >
          <ChevronLeft size={26} strokeWidth={2.5} />
        </button>
      ) : <div style={{ width: 40 }} />}

      <h3 style={{
        flex: 1, textAlign: 'center', fontSize: 17,
        fontWeight: 600, color: 'var(--text-1)',
      }}>
        {title}
      </h3>

      <div style={{ width: 40, display: 'flex', justifyContent: 'flex-end' }}>
        {right}
      </div>
    </header>
  );
};
