import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => {
      navigate(isAuthenticated ? '/home' : '/auth', { replace: true });
    }, 2200);
    return () => clearTimeout(t);
  }, [navigate, isAuthenticated]);

  return (
    <div style={{
      height: '100vh', width: '100%',
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 24,
      animation: 'fadeIn 0.5s ease',
    }}>
      {/* Logo */}
      <div style={{
        width: 96, height: 96, borderRadius: 28,
        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 20px 60px rgba(99,102,241,0.4)',
        animation: 'pulse 2s infinite',
        fontSize: 48,
      }}>
        💪
      </div>

      <div style={{ textAlign: 'center', animation: 'slideUp 0.5s ease 0.3s both' }}>
        <h1 style={{
          fontSize: 36, fontWeight: 800, letterSpacing: -1,
          background: 'linear-gradient(135deg, #6366F1, #A78BFA)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          FitTrack Pro
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: 15, marginTop: 4 }}>
          Entrena. Progresa. Domina.
        </p>
      </div>

      {/* Loading dots */}
      <div style={{
        display: 'flex', gap: 8, marginTop: 32,
        animation: 'slideUp 0.5s ease 0.6s both',
      }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--primary)',
            animation: `pulse 1s ease ${i * 0.2}s infinite`,
            opacity: 0.7,
          }} />
        ))}
      </div>
    </div>
  );
};
