import React from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Lightbulb, Trophy } from 'lucide-react';
import { Header } from '../components/common/Header';
import { getExerciseById, muscleGroups, equipmentLabels, difficultyLabels } from '../data/exercises';
import { mockPRs } from '../data/mockData';

const MUSCLE_COLORS: Record<string, string> = {
  chest: '#EF4444', back: '#3B82F6', shoulders: '#8B5CF6', biceps: '#F97316',
  triceps: '#EC4899', legs: '#10B981', glutes: '#14B8A6', core: '#F59E0B',
  cardio: '#EF4444', full_body: '#6366F1',
};

export const ExerciseDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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

  return (
    <div className="screen-full" style={{ background: 'var(--bg)' }}>
      <Header title={exercise.name} showBack />

      {/* Hero */}
      <div style={{
        background: `linear-gradient(160deg, ${mainColor}30, transparent)`,
        padding: '24px 20px 32px',
        textAlign: 'center',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: `${mainColor}20`, margin: '0 auto 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40,
        }}>
          🏋️
        </div>
        <h2 style={{ fontSize: 22, marginBottom: 12 }}>{exercise.name}</h2>
        <div className="flex justify-center gap-8 flex-wrap">
          <span className="badge" style={{ background: `${mainColor}20`, color: mainColor }}>
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
      </div>

      <div style={{ padding: '0 16px 32px' }}>
        {/* PR */}
        {pr && (
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <div className="flex items-center gap-12">
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'var(--warning-dim)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Trophy size={22} color="var(--warning)" />
              </div>
              <div>
                <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Tu Récord Personal</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)' }}>
                  {pr.weight} kg × {pr.reps} reps
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-3)' }}>1RM estimado: {pr.oneRepMax} kg</p>
              </div>
            </div>
          </div>
        )}

        {/* Muscles */}
        <div className="card" style={{ padding: 16, marginBottom: 12 }}>
          <h4 style={{ marginBottom: 12 }}>Músculos Trabajados</h4>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 6 }}>Principal</p>
            <div className="flex items-center gap-8">
              <span className="muscle-dot" style={{ background: mainColor }} />
              <span style={{ fontSize: 14, fontWeight: 500 }}>{muscleName}</span>
            </div>
          </div>
          {exercise.secondaryMuscles.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 6 }}>Secundarios</p>
              <div className="flex flex-wrap gap-8">
                {exercise.secondaryMuscles.map(m => (
                  <div key={m} className="flex items-center gap-6">
                    <span className="muscle-dot" style={{ background: MUSCLE_COLORS[m] ?? '#888' }} />
                    <span style={{ fontSize: 13, color: 'var(--text-2)' }}>
                      {muscleGroups.find(mg => mg.id === m)?.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="card" style={{ padding: 16, marginBottom: 12 }}>
          <h4 style={{ marginBottom: 10 }}>Descripción</h4>
          <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>{exercise.description}</p>
        </div>

        {/* Instructions */}
        <div className="card" style={{ padding: 16, marginBottom: 12 }}>
          <div className="flex items-center gap-10" style={{ marginBottom: 12 }}>
            <CheckCircle size={18} color="var(--success)" />
            <h4>Instrucciones</h4>
          </div>
          {exercise.instructions.map((step, i) => (
            <div key={i} className="flex gap-12" style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < exercise.instructions.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{
                width: 24, height: 24, borderRadius: '50%',
                background: 'var(--primary-dim)', color: 'var(--primary)',
                fontSize: 12, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 1,
              }}>
                {i + 1}
              </span>
              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>{step}</p>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="card" style={{ padding: 16, marginBottom: 12 }}>
          <div className="flex items-center gap-10" style={{ marginBottom: 12 }}>
            <Lightbulb size={18} color="var(--secondary)" />
            <h4>Consejos Pro</h4>
          </div>
          {exercise.tips.map((tip, i) => (
            <div key={i} className="flex gap-12" style={{ marginBottom: i < exercise.tips.length - 1 ? 10 : 0 }}>
              <span style={{ color: 'var(--secondary)', flexShrink: 0, fontSize: 16 }}>→</span>
              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>{tip}</p>
            </div>
          ))}
        </div>

        {/* Common Mistakes */}
        <div className="card" style={{ padding: 16 }}>
          <div className="flex items-center gap-10" style={{ marginBottom: 12 }}>
            <AlertTriangle size={18} color="var(--error)" />
            <h4>Errores Comunes</h4>
          </div>
          {exercise.commonMistakes.map((mistake, i) => (
            <div key={i} className="flex gap-12" style={{ marginBottom: i < exercise.commonMistakes.length - 1 ? 10 : 0 }}>
              <span style={{ color: 'var(--error)', flexShrink: 0, fontSize: 16 }}>✗</span>
              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>{mistake}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
