import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ChevronRight, Zap, TrendingUp, Calendar, Flame } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWorkout } from '../contexts/WorkoutContext';
import { mockAIInsights, formatVolume, formatDuration } from '../data/mockData';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { workouts, routines } = useWorkout();

  const recentWorkouts = workouts.slice(0, 4);
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 18) return 'Buenas tardes';
    return 'Buenas noches';
  })();

  const weekVolume = user?.stats.thisWeekVolume ?? 0;
  const weekWorkouts = user?.stats.thisWeekWorkouts ?? 0;
  const streak = user?.stats.streak ?? 0;

  return (
    <div className="screen anim-fade">
      {/* Header */}
      <div style={{ padding: '20px 20px 0' }}>
        <div className="flex items-center justify-between">
          <div>
            <p style={{ color: 'var(--text-2)', fontSize: 14 }}>{greeting},</p>
            <h2 style={{ fontSize: 24, marginTop: 2 }}>{user?.name?.split(' ')[0] ?? 'Atleta'} 👋</h2>
          </div>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => navigate('/profile')}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'var(--primary-dim)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: 'pointer',
                fontSize: 18, fontWeight: 700, color: 'var(--primary)',
              }}
            >
              {user?.name?.slice(0, 1) ?? 'A'}
            </button>
            {streak > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: 'var(--secondary)', color: '#000',
                borderRadius: '50%', width: 18, height: 18,
                fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {streak}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Streak / quick stats */}
      <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <div className="stat-card" style={{ alignItems: 'center', textAlign: 'center', padding: 12 }}>
          <Flame size={18} color="var(--secondary)" />
          <div className="stat-value" style={{ fontSize: 22 }}>{streak}</div>
          <div className="stat-label">Racha</div>
        </div>
        <div className="stat-card" style={{ alignItems: 'center', textAlign: 'center', padding: 12 }}>
          <Calendar size={18} color="var(--primary)" />
          <div className="stat-value" style={{ fontSize: 22 }}>{weekWorkouts}</div>
          <div className="stat-label">Esta semana</div>
        </div>
        <div className="stat-card" style={{ alignItems: 'center', textAlign: 'center', padding: 12 }}>
          <TrendingUp size={18} color="var(--success)" />
          <div className="stat-value" style={{ fontSize: 20 }}>{formatVolume(weekVolume)}</div>
          <div className="stat-label">Volumen</div>
        </div>
      </div>

      {/* Start workout CTA */}
      <div style={{ padding: '0 20px 20px' }}>
        <div className="gradient-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/workout')}>
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 4 }}>
                ENTRENAMIENTO RÁPIDO
              </p>
              <h3 style={{ color: 'white', fontSize: 20 }}>Empezar Ahora</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 }}>
                Vacío o desde una rutina
              </p>
            </div>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Play size={24} color="white" fill="white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick access routines */}
      <div style={{ padding: '0 20px 20px' }}>
        <div className="section-header">
          <h3 style={{ fontSize: 18 }}>Mis Rutinas</h3>
          <span
            style={{ fontSize: 13, color: 'var(--primary)', cursor: 'pointer', fontWeight: 500 }}
            onClick={() => navigate('/routines')}
          >
            Ver todas <ChevronRight size={14} style={{ verticalAlign: 'middle' }} />
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
          {routines.slice(0, 4).map(r => (
            <div
              key={r.id}
              onClick={() => navigate('/workout', { state: { routineId: r.id } })}
              style={{
                flexShrink: 0, width: 140,
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 14, padding: '14px 14px',
                cursor: 'pointer',
                borderLeft: `3px solid ${r.color ?? 'var(--primary)'}`,
              }}
            >
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', marginBottom: 4 }}>
                {r.name}
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
                {r.exercises.length} ejercicios
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
                ~{r.estimatedDuration}min
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div style={{ padding: '0 20px 20px' }}>
        <div className="section-header">
          <div className="flex items-center gap-8">
            <Zap size={18} color="var(--secondary)" />
            <h3 style={{ fontSize: 18 }}>IA Insights</h3>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {mockAIInsights.slice(0, 2).map(insight => (
            <div key={insight.id} className="card" style={{ padding: 16 }}>
              <div className="flex gap-12">
                <span style={{ fontSize: 24, flexShrink: 0 }}>{insight.icon}</span>
                <div>
                  <p style={{
                    fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 4,
                  }}>
                    {insight.title}
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
                    {insight.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Workouts */}
      <div style={{ padding: '0 20px 20px' }}>
        <div className="section-header">
          <h3 style={{ fontSize: 18 }}>Últimos Entrenamientos</h3>
          <span
            style={{ fontSize: 13, color: 'var(--primary)', cursor: 'pointer', fontWeight: 500 }}
            onClick={() => navigate('/stats')}
          >
            Ver historial <ChevronRight size={14} style={{ verticalAlign: 'middle' }} />
          </span>
        </div>
        <div className="card">
          {recentWorkouts.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 16px' }}>
              <span className="empty-icon">🏋️</span>
              <p className="empty-title">Sin entrenamientos aún</p>
              <p className="empty-desc">¡Empieza tu primer entrenamiento ahora!</p>
            </div>
          ) : (
            recentWorkouts.map((w, i) => (
              <div
                key={w.id}
                className="list-item"
                onClick={() => navigate('/stats')}
                style={{ borderBottom: i < recentWorkouts.length - 1 ? '1px solid var(--border)' : 'none' }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: 'var(--primary-dim)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, flexShrink: 0,
                }}>
                  🏋️
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)' }}>{w.name}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 2 }}>
                    {w.date} · {formatDuration(w.duration)} · {w.totalSets} series
                  </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary)' }}>
                    {formatVolume(w.volume)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Level progress */}
      <div style={{ padding: '0 20px 32px' }}>
        <div className="card" style={{ padding: 16 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
            <div className="flex items-center gap-12">
              <span style={{ fontSize: 24 }}>⭐</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600 }}>Nivel {user?.level}</p>
                <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
                  {user?.xp} / {user?.xpNextLevel} XP
                </p>
              </div>
            </div>
            <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500 }}>
              Nivel {(user?.level ?? 0) + 1}
            </span>
          </div>
          <div className="xp-bar">
            <div
              className="xp-fill"
              style={{ width: `${((user?.xp ?? 0) / (user?.xpNextLevel ?? 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
