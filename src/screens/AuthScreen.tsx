import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { AuthScreen as AuthMode } from '../types';

export const AuthScreen: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    let ok = false;
    if (mode === 'login') {
      ok = await login(email, password);
    } else if (mode === 'register') {
      if (!name.trim()) { setError('El nombre es obligatorio'); return; }
      ok = await register(name, email, password);
    }
    if (ok) navigate('/home', { replace: true });
    else setError('Credenciales incorrectas. Inténtalo de nuevo.');
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      overflow: 'auto',
    }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        padding: '60px 32px 40px',
        textAlign: 'center',
        flexShrink: 0,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          margin: '0 auto 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, boxShadow: '0 12px 40px rgba(99,102,241,0.4)',
        }}>
          💪
        </div>
        <h1 style={{
          fontSize: 32, fontWeight: 800,
          background: 'linear-gradient(135deg, #fff, #c7d2fe)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 8,
        }}>
          FitTrack Pro
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15 }}>
          Registra, planifica y analiza tus entrenamientos
        </p>
      </div>

      {/* Form Card */}
      <div style={{
        flex: 1, background: 'var(--surface)',
        borderRadius: '24px 24px 0 0',
        padding: '28px 24px 40px',
        marginTop: -8,
      }}>
        {/* Tab switcher */}
        {mode !== 'forgot' && (
          <div className="tab-bar" style={{ marginBottom: 28 }}>
            <div
              className={`tab-item ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError(''); }}
            >
              Iniciar Sesión
            </div>
            <div
              className={`tab-item ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setError(''); }}
            >
              Registrarse
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {mode === 'register' && (
            <div className="input-icon-wrap">
              <User size={18} className="input-icon" />
              <input
                className="input"
                type="text"
                placeholder="Tu nombre completo"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                style={{ paddingLeft: 44 }}
              />
            </div>
          )}

          <div className="input-icon-wrap">
            <Mail size={18} className="input-icon" />
            <input
              className="input"
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ paddingLeft: 44 }}
            />
          </div>

          {mode !== 'forgot' && (
            <div style={{ position: 'relative' }}>
              <div className="input-icon-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  className="input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Contraseña"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ paddingLeft: 44, paddingRight: 44 }}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                style={{
                  position: 'absolute', right: 14, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-3)', padding: 0,
                }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          )}

          {error && (
            <p style={{
              color: 'var(--error)', fontSize: 13,
              background: 'var(--error-dim)', padding: '10px 14px',
              borderRadius: 8,
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={isLoading}
            style={{ marginTop: 8 }}
          >
            {isLoading ? (
              <span style={{
                width: 20, height: 20, borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid white',
                animation: 'spin 0.8s linear infinite',
                display: 'inline-block',
              }} />
            ) : (
              <>
                {mode === 'login' ? 'Entrar' : mode === 'register' ? 'Crear Cuenta' : 'Enviar enlace'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {mode === 'login' && (
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: 'var(--text-2)' }}>
            <span
              style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 500 }}
              onClick={() => { setMode('forgot'); setError(''); }}
            >
              ¿Olvidaste tu contraseña?
            </span>
          </p>
        )}

        {mode === 'forgot' && (
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: 'var(--text-2)' }}>
            <span
              style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 500 }}
              onClick={() => { setMode('login'); setError(''); }}
            >
              ← Volver al inicio de sesión
            </span>
          </p>
        )}

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0',
        }}>
          <div className="divider" style={{ flex: 1, margin: 0 }} />
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>O continúa con</span>
          <div className="divider" style={{ flex: 1, margin: 0 }} />
        </div>

        {/* Social buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost btn-full" style={{ gap: 8, fontSize: 14 }}>
            <span style={{ fontSize: 18 }}>🇬</span> Google
          </button>
          <button className="btn btn-ghost btn-full" style={{ gap: 8, fontSize: 14 }}>
            <span style={{ fontSize: 18 }}>🍎</span> Apple
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'var(--text-3)' }}>
          Al continuar aceptas los{' '}
          <span style={{ color: 'var(--primary)' }}>Términos de Uso</span>
          {' '}y la{' '}
          <span style={{ color: 'var(--primary)' }}>Política de Privacidad</span>
        </p>
      </div>
    </div>
  );
};
