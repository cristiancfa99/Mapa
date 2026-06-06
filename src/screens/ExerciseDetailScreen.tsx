import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Lightbulb, Trophy, Youtube, Play, Users, BookOpen } from 'lucide-react';
import { Header } from '../components/common/Header';
import { MuscleMap } from '../components/common/MuscleMap';
import { ExerciseAnimation, MOVEMENT_MAP } from '../components/common/ExerciseAnimation';
import { getExerciseById, muscleGroups, equipmentLabels, difficultyLabels } from '../data/exercises';
import { mockPRs } from '../data/mockData';

const MUSCLE_COLORS: Record<string, string> = {
  chest: '#EF4444', back: '#3B82F6', shoulders: '#8B5CF6', biceps: '#F97316',
  triceps: '#EC4899', legs: '#10B981', glutes: '#14B8A6', core: '#F59E0B',
  cardio: '#EF4444', full_body: '#6366F1',
};

type Tab = 'demo' | 'muscles' | 'steps';

export const ExerciseDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<Tab>('demo');
  const exercise = getExerciseById(id ?? '');
  const pr = mockPRs.find(p => p.exerciseId === id);

  if (!exercise) {
    return (
      <div className="screen">
        <Header title="Ejercicio" showBack />
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <p className="empty-title">Ejercicio no encontrado</p>
        </div>
      </div>
    );
  }

  const mainColor = MUSCLE_COLORS[exercise.muscleGroup] ?? 'var(--primary)';
  const muscleName = muscleGroups.find(m => m.id === exercise.muscleGroup)?.label;
  const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name + ' tutorial tecnica correcta')}`;

  const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: 'demo',    icon: <Play    size={14}/>, label: 'Demo'     },
    { id: 'muscles', icon: <Users   size={14}/>, label: 'Músculos' },
    { id: 'steps',   icon: <BookOpen size={14}/>, label: 'Guía'    },
  ];

  return (
    <div className="screen-full" style={{ background: 'var(--bg)' }}>
      <Header title={exercise.name} showBack />

      {/* ── Hero gradient ── */}
      <div style={{
        background: `linear-gradient(160deg, ${mainColor}28 0%, transparent 70%)`,
        padding: '20px 16px 0',
      }}>
        {/* Badges row */}
        <div className="flex gap-8 flex-wrap" style={{ marginBottom: 14 }}>
          <span className="badge" style={{ background: `${mainColor}22`, color: mainColor }}>
            {muscleName}
          </span>
          <span className="badge badge-primary">{equipmentLabels[exercise.equipment]}</span>
          <span className="badge" style={{
            background: exercise.difficulty === 'beginner' ? 'var(--success-dim)' :
              exercise.difficulty === 'intermediate' ? 'var(--warning-dim)' : 'var(--error-dim)',
            color: exercise.difficulty === 'beginner' ? 'var(--success)' :
              exercise.difficulty === 'intermediate' ? 'var(--warning)' : 'var(--error)',
          }}>
            {difficultyLabels[exercise.difficulty]}
          </span>
        </div>

        {/* Tab selector */}
        <div style={{
          display: 'flex', background: 'var(--surface)',
          borderRadius: 14, padding: 4, gap: 2,
        }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '9px 4px', border: 'none', borderRadius: 11, cursor: 'pointer',
                fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
                background: tab === t.id ? (t.id === 'demo' ? mainColor : 'var(--primary)') : 'transparent',
                color: tab === t.id ? '#fff' : 'var(--text-3)',
                transition: 'all .18s',
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div style={{ padding: '0 16px 100px' }}>

        {/* ── DEMO TAB ── */}
        {tab === 'demo' && (
          <>
            {/* Animation */}
            <div style={{
              background: `${mainColor}0e`,
              border: `1px solid ${mainColor}22`,
              borderRadius: 20,
              margin: '16px 0',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 220,
            }}>
              <ExerciseAnimation
                type={MOVEMENT_MAP[exercise.id] ?? 'push_h'}
                color={mainColor}
              />
            </div>

            {/* YouTube CTA */}
            <a
              href={ytUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                background: '#FF000018', color: '#FF4040',
                border: '1px solid #FF404030', borderRadius: 14,
                padding: '13px 20px', fontSize: 14, fontWeight: 700,
                textDecoration: 'none', marginBottom: 16,
              }}
            >
              <Youtube size={18}/>
              Ver video real en YouTube
            </a>

            {/* PR */}
            {pr && (
              <div className="card" style={{ padding: 16, marginBottom: 16 }}>
                <div className="flex items-center gap-12">
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: 'var(--warning-dim)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Trophy size={22} color="var(--warning)"/>
                  </div>
                  <div>
                    <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Tu Récord Personal</p>
                    <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)' }}>
                      {pr.weight} kg × {pr.reps} reps
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-3)' }}>1RM est.: {pr.oneRepMax} kg</p>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="card" style={{ padding: 16 }}>
              <h4 style={{ marginBottom: 10 }}>Descripción</h4>
              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65 }}>
                {exercise.description}
              </p>
            </div>
          </>
        )}

        {/* ── MUSCLES TAB ── */}
        {tab === 'muscles' && (
          <div className="card" style={{ padding: 16, marginTop: 16 }}>
            <h4 style={{ marginBottom: 16 }}>Músculos Trabajados</h4>
            <MuscleMap primary={exercise.muscleGroup} secondary={exercise.secondaryMuscles}/>
            <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
              <div className="flex items-center gap-8" style={{ marginBottom: 10 }}>
                <span style={{
                  width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                  background: mainColor,
                }}/>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{muscleName}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 8,
                  background: `${mainColor}22`, color: mainColor,
                }}>PRINCIPAL</span>
              </div>
              {exercise.secondaryMuscles.length > 0 && (
                <>
                  <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8, fontWeight: 700, letterSpacing: '0.5px' }}>
                    SECUNDARIOS
                  </p>
                  <div className="flex flex-wrap gap-8">
                    {exercise.secondaryMuscles.map(m => (
                      <div key={m} className="flex items-center gap-6">
                        <span style={{
                          width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                          background: MUSCLE_COLORS[m] ?? '#888',
                        }}/>
                        <span style={{ fontSize: 13, color: 'var(--text-2)' }}>
                          {muscleGroups.find(mg => mg.id === m)?.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── STEPS TAB ── */}
        {tab === 'steps' && (
          <>
            {/* Instructions */}
            <div className="card" style={{ padding: 16, marginTop: 16, marginBottom: 12 }}>
              <div className="flex items-center gap-10" style={{ marginBottom: 14 }}>
                <CheckCircle size={18} color="var(--success)"/>
                <h4>Instrucciones Paso a Paso</h4>
              </div>
              {exercise.instructions.map((step, i) => (
                <div key={i} className="flex gap-12" style={{
                  marginBottom: 14, paddingBottom: 14,
                  borderBottom: i < exercise.instructions.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <span style={{
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                    background: `${mainColor}20`, color: mainColor,
                    fontSize: 12, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginTop: 1,
                  }}>
                    {i + 1}
                  </span>
                  <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65 }}>{step}</p>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="card" style={{ padding: 16, marginBottom: 12 }}>
              <div className="flex items-center gap-10" style={{ marginBottom: 14 }}>
                <Lightbulb size={18} color="var(--secondary)"/>
                <h4>Consejos Pro</h4>
              </div>
              {exercise.tips.map((tip, i) => (
                <div key={i} className="flex gap-10" style={{ marginBottom: i < exercise.tips.length - 1 ? 12 : 0 }}>
                  <span style={{ color: 'var(--secondary)', flexShrink: 0, fontSize: 18, lineHeight: 1.4 }}>→</span>
                  <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65 }}>{tip}</p>
                </div>
              ))}
            </div>

            {/* Common Mistakes */}
            <div className="card" style={{ padding: 16 }}>
              <div className="flex items-center gap-10" style={{ marginBottom: 14 }}>
                <AlertTriangle size={18} color="var(--error)"/>
                <h4>Errores Comunes</h4>
              </div>
              {exercise.commonMistakes.map((mistake, i) => (
                <div key={i} className="flex gap-10" style={{ marginBottom: i < exercise.commonMistakes.length - 1 ? 12 : 0 }}>
                  <span style={{ color: 'var(--error)', flexShrink: 0, fontSize: 18, lineHeight: 1.4 }}>✗</span>
                  <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65 }}>{mistake}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
