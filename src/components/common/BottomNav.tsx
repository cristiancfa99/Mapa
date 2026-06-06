import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Dumbbell, BarChart2, User, Plus } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/home',      icon: Home,     label: 'Inicio'    },
  { path: '/exercises', icon: Dumbbell, label: 'Ejercicios'},
  { path: null,         icon: Plus,     label: ''          },
  { path: '/stats',     icon: BarChart2,label: 'Stats'     },
  { path: '/profile',   icon: User,     label: 'Perfil'    },
];

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 80,
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      height: 'var(--nav-h)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      maxWidth: '428px', margin: '0 auto',
      insetInline: '50%', transform: 'translateX(-50%)',
    }}>
      {NAV_ITEMS.map((item, i) => {
        if (item.path === null) {
          return (
            <div key="fab" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/workout')}
                style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: 'var(--primary)', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.93)')}
                onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                onTouchStart={e => (e.currentTarget.style.transform = 'scale(0.93)')}
                onTouchEnd={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <Plus size={26} color="white" strokeWidth={2.5} />
              </button>
            </div>
          );
        }

        const Icon = item.icon;
        const active = pathname.startsWith(item.path);

        return (
          <button
            key={i}
            onClick={() => navigate(item.path!)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 3,
              border: 'none', background: 'transparent',
              cursor: 'pointer', padding: '8px 0',
              color: active ? 'var(--primary)' : 'var(--text-3)',
              transition: 'color 0.15s',
            }}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 2} />
            <span style={{
              fontSize: 10, fontWeight: active ? 600 : 400,
              fontFamily: 'inherit',
              color: active ? 'var(--primary)' : 'var(--text-3)',
            }}>
              {item.label}
            </span>
            {active && (
              <span style={{
                position: 'absolute', bottom: 8, width: 4, height: 4,
                borderRadius: '50%', background: 'var(--primary)',
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );
};
