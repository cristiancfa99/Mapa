import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Trophy, TrendingUp, Dumbbell, Clock, Zap } from 'lucide-react';
import {
  mockWeeklyVolume, mockPRs, mockBodyWeight,
  mockBenchProgress, mockAIInsights, formatVolume, formatDuration,
} from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const RADAR_DATA = [
  { muscle: 'Pecho', sets: 18 }, { muscle: 'Espalda', sets: 22 },
  { muscle: 'Hombros', sets: 14 }, { muscle: 'Bíceps', sets: 12 },
  { muscle: 'Tríceps', sets: 14 }, { muscle: 'Piernas', sets: 20 },
  { muscle: 'Core', sets: 8 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: 8, padding: '8px 12px',
    }}>
      <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>
        {payload[0]?.value?.toLocaleString()} {payload[0]?.name === 'weight' ? 'kg' : 'kg volumen'}
      </p>
    </div>
  );
};

export const StatisticsScreen: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'overview' | 'prs' | 'body'>('overview');

  return (
    <div className="screen anim-fade">
      {/* Top stats */}
      <div style={{ padding: '20px 16px 12px' }}>
        <h2 style={{ fontSize: 24, marginBottom: 16 }}>Estadísticas</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="stat-card">
            <Dumbbell size={20} color="var(--primary)" />
            <div className="stat-value">{user?.stats.totalWorkouts ?? 0}</div>
            <div className="stat-label">Entrenamientos</div>
          </div>
          <div className="stat-card">
            <TrendingUp size={20} color="var(--success)" />
            <div className="stat-value">{formatVolume(user?.stats.totalVolume ?? 0)}</div>
            <div className="stat-label">Volumen Total</div>
          </div>
          <div className="stat-card">
            <Clock size={20} color="var(--secondary)" />
            <div className="stat-value">{formatDuration(user?.stats.totalDuration ?? 0)}</div>
            <div className="stat-label">Tiempo Total</div>
          </div>
          <div className="stat-card">
            <Trophy size={20} color="var(--warning)" />
            <div className="stat-value">{mockPRs.length}</div>
            <div className="stat-label">Récords</div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ padding: '8px 16px 16px' }}>
        <div className="tab-bar">
          {(['overview', 'prs', 'body'] as const).map(t => (
            <div key={t} className={`tab-item ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'overview' ? 'Resumen' : t === 'prs' ? 'Records' : 'Peso'}
            </div>
          ))}
        </div>
      </div>

      {tab === 'overview' && (
        <>
          {/* Weekly Volume Chart */}
          <div style={{ padding: '0 16px 20px' }}>
            <div className="card" style={{ padding: '16px 8px' }}>
              <h4 style={{ padding: '0 8px', marginBottom: 16 }}>Volumen Semanal (kg)</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={mockWeeklyVolume} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="week" tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="volume" fill="var(--primary)" radius={[4,4,0,0]} name="volume" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bench progress */}
          <div style={{ padding: '0 16px 20px' }}>
            <div className="card" style={{ padding: '16px 8px' }}>
              <h4 style={{ padding: '0 8px', marginBottom: 16 }}>Progresión Press de Banca (kg)</h4>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={mockBenchProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[85,105]} tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone" dataKey="weight" stroke="var(--primary)"
                    strokeWidth={2.5} dot={{ fill: 'var(--primary)', r: 4 }}
                    name="weight"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Muscle Radar */}
          <div style={{ padding: '0 16px 20px' }}>
            <div className="card" style={{ padding: '16px 0' }}>
              <h4 style={{ padding: '0 16px', marginBottom: 8 }}>Distribución Muscular</h4>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={RADAR_DATA} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="muscle" tick={{ fill: 'var(--text-2)', fontSize: 12 }} />
                  <Radar name="series" dataKey="sets" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights */}
          <div style={{ padding: '0 16px 24px' }}>
            <div className="flex items-center gap-8" style={{ marginBottom: 12 }}>
              <Zap size={18} color="var(--secondary)" />
              <h4>IA Insights</h4>
            </div>
            {mockAIInsights.map(insight => (
              <div key={insight.id} className="card" style={{ padding: 14, marginBottom: 10 }}>
                <div className="flex gap-12">
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{insight.icon}</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{insight.title}</p>
                    <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>{insight.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'prs' && (
        <div style={{ padding: '0 16px 24px' }}>
          <h4 style={{ marginBottom: 12 }}>Récords Personales</h4>
          <div className="card">
            {mockPRs.map((pr, i) => (
              <div
                key={pr.exerciseId}
                className="list-item"
                style={{ borderBottom: i < mockPRs.length - 1 ? '1px solid var(--border)' : 'none' }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: 'var(--warning-dim)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Trophy size={18} color="var(--warning)" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, fontWeight: 600 }}>{pr.exerciseName}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-3)' }}>{pr.date}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-1)' }}>
                    {pr.weight} kg × {pr.reps}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-3)' }}>1RM ~{pr.oneRepMax} kg</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'body' && (
        <div style={{ padding: '0 16px 24px' }}>
          <div className="card" style={{ padding: '16px 8px', marginBottom: 16 }}>
            <h4 style={{ padding: '0 8px', marginBottom: 16 }}>Evolución del Peso Corporal (kg)</h4>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={mockBodyWeight}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: 'var(--text-3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={d => d.slice(5)} />
                <YAxis domain={[79, 82]} tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone" dataKey="weight" stroke="var(--success)"
                  strokeWidth={2.5} dot={{ fill: 'var(--success)', r: 4 }}
                  name="weight"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card" style={{ padding: 16 }}>
            {mockBodyWeight.slice(-4).reverse().map((bw, i) => (
              <div key={i} className="flex items-center justify-between" style={{ padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ color: 'var(--text-2)', fontSize: 14 }}>{bw.date}</span>
                <span style={{ fontWeight: 700, fontSize: 16 }}>{bw.weight} kg</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
