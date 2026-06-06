import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Play, Edit3, Trash2, Clock, Dumbbell, ChevronRight } from 'lucide-react';
import { useWorkout } from '../contexts/WorkoutContext';

const CATEGORY_LABELS: Record<string, string> = {
  push_pull_legs: 'Push Pull Legs', upper_lower: 'Upper / Lower',
  full_body: 'Full Body', custom: 'Personalizada',
};
const DIFF_COLORS: Record<string, string> = {
  beginner: 'var(--success)', intermediate: 'var(--secondary)', advanced: 'var(--error)',
};
const DIFF_LABELS: Record<string, string> = {
  beginner: 'Principiante', intermediate: 'Intermedio', advanced: 'Avanzado',
};

export const RoutineBuilderScreen: React.FC = () => {
  const navigate = useNavigate();
  const { routines, deleteRoutine, startFromRoutine } = useWorkout();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleStart = (id: string) => {
    const routine = routines.find(r => r.id === id);
    if (routine) {
      startFromRoutine(routine);
      navigate('/workout');
    }
  };

  return (
    <div className="screen anim-fade">
      <div style={{ padding: '20px 16px 12px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 24 }}>Mis Rutinas</h2>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/routines/new')}
          >
            <Plus size={16} /> Nueva
          </button>
        </div>

        {/* Templates */}
        <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 12 }}>
          Plantillas Populares
        </p>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, marginBottom: 20 }}>
          {[
            { name: 'Push Pull Legs', emoji: '🔄', desc: '3-6 días/sem' },
            { name: 'Upper / Lower', emoji: '⬆️', desc: '4 días/sem' },
            { name: 'Full Body', emoji: '💪', desc: '3 días/sem' },
            { name: 'Torso / Pierna', emoji: '🦵', desc: '4 días/sem' },
          ].map(t => (
            <div
              key={t.name}
              style={{
                flexShrink: 0, width: 130,
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 14, padding: 14, cursor: 'pointer',
              }}
              onClick={() => {}}
            >
              <span style={{ fontSize: 24 }}>{t.emoji}</span>
              <p style={{ fontSize: 13, fontWeight: 600, marginTop: 6, marginBottom: 2 }}>{t.name}</p>
              <p style={{ fontSize: 12, color: 'var(--text-3)' }}>{t.desc}</p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 12 }}>
          Mis Rutinas ({routines.length})
        </p>
      </div>

      {routines.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <p className="empty-title">Sin rutinas</p>
          <p className="empty-desc">Crea tu primera rutina personalizada</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/routines/new')}>
            <Plus size={16} /> Crear Rutina
          </button>
        </div>
      ) : (
        <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {routines.map(r => (
            <div key={r.id} className="card" style={{ padding: 16 }}>
              <div className="flex items-start justify-between" style={{ marginBottom: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex items-center gap-10" style={{ marginBottom: 4 }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: r.color ?? 'var(--primary)', flexShrink: 0,
                    }} />
                    <h4 style={{ fontSize: 16 }}>{r.name}</h4>
                  </div>
                  {r.description && (
                    <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8, marginLeft: 20 }}>
                      {r.description}
                    </p>
                  )}
                  <div className="flex items-center gap-12 flex-wrap" style={{ marginLeft: 20 }}>
                    <span className="flex items-center gap-4" style={{ color: 'var(--text-3)', fontSize: 12 }}>
                      <Dumbbell size={12} /> {r.exercises.length} ej.
                    </span>
                    <span className="flex items-center gap-4" style={{ color: 'var(--text-3)', fontSize: 12 }}>
                      <Clock size={12} /> ~{r.estimatedDuration}min
                    </span>
                    <span style={{ fontSize: 11, color: DIFF_COLORS[r.difficulty] ?? '#888', fontWeight: 500 }}>
                      {DIFF_LABELS[r.difficulty]}
                    </span>
                    <span style={{
                      fontSize: 11, color: 'var(--text-3)',
                      background: 'var(--card)', padding: '2px 8px', borderRadius: 'var(--radius-full)',
                    }}>
                      {CATEGORY_LABELS[r.category]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Exercise preview */}
              <div style={{ marginBottom: 14, paddingLeft: 20 }}>
                {r.exercises.slice(0, 3).map((re, i) => (
                  <p key={re.id} style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 3 }}>
                    {i + 1}. {re.exercise.name} – {re.sets}×{re.repsMin}-{re.repsMax}
                  </p>
                ))}
                {r.exercises.length > 3 && (
                  <p style={{ fontSize: 12, color: 'var(--primary)' }}>
                    +{r.exercises.length - 3} más
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-8">
                <button
                  className="btn btn-primary flex-1"
                  style={{ padding: '10px', fontSize: 14 }}
                  onClick={() => handleStart(r.id)}
                >
                  <Play size={16} fill="white" /> Iniciar
                </button>
                <button
                  className="btn-icon"
                  onClick={() => {}}
                  title="Editar"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  className="btn-icon"
                  onClick={() => setDeleteConfirm(r.id)}
                  style={{ color: 'var(--error)', borderColor: 'var(--error-dim)', background: 'var(--error-dim)' }}
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="overlay overlay-center" onClick={() => setDeleteConfirm(null)}>
          <div
            className="card"
            style={{ margin: 20, padding: 24, width: '100%', maxWidth: 340 }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>¿Eliminar rutina?</h3>
            <p style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 20 }}>
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-12">
              <button className="btn btn-ghost btn-full" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </button>
              <button
                className="btn btn-danger btn-full"
                onClick={() => { deleteRoutine(deleteConfirm); setDeleteConfirm(null); }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
