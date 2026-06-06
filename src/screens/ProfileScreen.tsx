import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, Settings, Crown, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatVolume, formatDuration, getGoalLabel } from '../data/mockData';

const GOAL_ICONS: Record<string, string> = {
  muscle_gain: '💪', fat_loss: '🔥', recomposition: '⚡',
  strength: '🏋️', endurance: '🏃', general_fitness: '🎯',
};
const CATEGORY_LABELS: Record<string, string> = {
  milestone: 'Hitos', streak: 'Rachas', strength: 'Fuerza', consistency: 'Constancia',
};

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [badgeFilter, setBadgeFilter] = useState<string>('all');

  if (!user) return null;

  const xpPct = Math.round((user.xp / user.xpNextLevel) * 100);
  const filteredBadges = badgeFilter === 'all'
    ? user.badges
    : user.badges.filter(b => b.category === badgeFilter);

  return (
    <div className="screen anim-fade">
      {/* Header */}
      <div style={{ padding: '20px 16px 0' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 24 }}>Perfil</h2>
          <div className="flex gap-8">
            <button className="btn-icon" onClick={() => navigate('/settings')}>
              <Settings size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Hero */}
      <div style={{ padding: '0 16px 20px' }}>
        <div className="card" style={{ padding: 20 }}>
          <div className="flex items-center gap-16">
            <div className="avatar avatar-xl" style={{
              background: 'var(--primary-dim)', color: 'var(--primary)',
              fontSize: 28, fontWeight: 800,
            }}>
              {user.name.slice(0, 1)}
            </div>
            <div style={{ flex: 1 }}>
              <div className="flex items-center gap-8">
                <h3 style={{ fontSize: 20 }}>{user.name}</h3>
                {user.isPremium && (
                  <span style={{
                    background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
                    padding: '2px 8px', borderRadius: 'var(--radius-full)',
                    fontSize: 11, fontWeight: 700, color: 'white',
                  }}>
                    PRO
                  </span>
                )}
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 6 }}>{user.email}</p>
              <div className="flex items-center gap-8">
                <span style={{
                  background: 'var(--primary-dim)', color: 'var(--primary)',
                  padding: '3px 10px', borderRadius: 'var(--radius-full)',
                  fontSize: 12, fontWeight: 700,
                }}>
                  ⭐ Nivel {user.level}
                </span>
                <span style={{ fontSize: 13, color: 'var(--text-3)' }}>
                  {GOAL_ICONS[user.goal]} {getGoalLabel(user.goal)}
                </span>
              </div>
            </div>
          </div>

          {/* XP Bar */}
          <div style={{ marginTop: 16 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Experiencia</span>
              <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>
                {user.xp} / {user.xpNextLevel} XP
              </span>
            </div>
            <div className="xp-bar">
              <div className="xp-fill" style={{ width: `${xpPct}%` }} />
            </div>
          </div>

          <button
            className="btn btn-ghost btn-full"
            style={{ marginTop: 14, gap: 8 }}
            onClick={() => {}}
          >
            <Edit3 size={16} /> Editar Perfil
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ padding: '0 16px 20px' }}>
        <h4 style={{ marginBottom: 12 }}>Estadísticas</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="stat-card">
            <div className="stat-value">{user.stats.totalWorkouts}</div>
            <div className="stat-label">Entrenamientos</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{formatVolume(user.stats.totalVolume)}</div>
            <div className="stat-label">Volumen Total</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{user.stats.streak}🔥</div>
            <div className="stat-label">Racha Actual</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{user.stats.longestStreak}</div>
            <div className="stat-label">Racha Máxima</div>
          </div>
        </div>
      </div>

      {/* Body stats */}
      <div style={{ padding: '0 16px 20px' }}>
        <h4 style={{ marginBottom: 12 }}>Datos Físicos</h4>
        <div className="card" style={{ padding: 0 }}>
          {[
            { label: 'Peso', value: user.weight ? `${user.weight} kg` : '—' },
            { label: 'Altura', value: user.height ? `${user.height} cm` : '—' },
            { label: 'Edad', value: user.age ? `${user.age} años` : '—' },
            { label: 'IMC', value: user.weight && user.height ? `${(user.weight / Math.pow(user.height / 100, 2)).toFixed(1)}` : '—' },
            { label: 'Objetivo', value: getGoalLabel(user.goal) },
            { label: 'Nivel', value: { beginner: 'Principiante', intermediate: 'Intermedio', advanced: 'Avanzado' }[user.experienceLevel] },
          ].map(({ label, value }, i, arr) => (
            <div
              key={label}
              className="flex items-center justify-between"
              style={{ padding: '14px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}
            >
              <span style={{ color: 'var(--text-2)', fontSize: 14 }}>{label}</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div style={{ padding: '0 16px 32px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <h4>Insignias ({user.badges.filter(b => !b.locked).length}/{user.badges.length})</h4>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 14 }}>
          {['all', 'milestone', 'streak', 'strength', 'consistency'].map(cat => (
            <button
              key={cat}
              className={`chip ${badgeFilter === cat ? 'active' : ''}`}
              style={{ flexShrink: 0 }}
              onClick={() => setBadgeFilter(cat)}
            >
              {cat === 'all' ? 'Todas' : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {filteredBadges.map(badge => (
            <div
              key={badge.id}
              className="card"
              style={{
                padding: '14px 10px', textAlign: 'center',
                opacity: badge.locked ? 0.4 : 1,
                filter: badge.locked ? 'grayscale(1)' : 'none',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 6 }}>{badge.icon}</div>
              <p style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3, marginBottom: 4 }}>{badge.name}</p>
              {badge.locked ? (
                <span style={{ fontSize: 10, color: 'var(--text-3)' }}>🔒 Bloqueado</span>
              ) : (
                <span style={{ fontSize: 10, color: 'var(--success)' }}>✓ {badge.earnedAt?.slice(0, 7)}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Premium Banner */}
      {!user.isPremium && (
        <div style={{ padding: '0 16px 32px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
            borderRadius: 16, padding: 20,
            display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer',
          }}>
            <Crown size={32} color="white" />
            <div>
              <p style={{ color: 'white', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                Hazte Premium
              </p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                IA avanzada, estadísticas ilimitadas y más
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
