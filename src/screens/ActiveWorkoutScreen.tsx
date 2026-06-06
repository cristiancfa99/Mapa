import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, X, Check, ChevronDown, ChevronUp, Timer, RotateCcw, CheckCircle } from 'lucide-react';
import { useWorkout } from '../contexts/WorkoutContext';
import { useStopwatch, useCountdown } from '../hooks/useTimer';
import { mockRoutines } from '../data/mockData';
import { exercises } from '../data/exercises';
import type { WorkoutExercise } from '../types';

const REST_PRESETS = [60, 90, 120, 180, 240];

function blankExerciseFromId(exId: string): WorkoutExercise | null {
  const ex = exercises.find(e => e.id === exId);
  if (!ex) return null;
  return {
    id: `we-${Date.now()}`,
    exerciseId: exId, exercise: ex, restTime: 90,
    sets: [{ id: `s-${Date.now()}`, reps: undefined, weight: undefined, completed: false }],
  };
}

export const ActiveWorkoutScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeWorkout, startWorkout, startFromRoutine, updateSet, addSet, finishWorkout, discardWorkout } = useWorkout();
  const stopwatch = useStopwatch();
  const countdown = useCountdown(90);
  const [expandedEx, setExpandedEx] = useState<string | null>(null);
  const [showFinish, setShowFinish] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);

  useEffect(() => {
    if (!activeWorkout) {
      const state = location.state as { routineId?: string } | null;
      if (state?.routineId) {
        const routine = mockRoutines.find(r => r.id === state.routineId);
        if (routine) { startFromRoutine(routine); return; }
      }
      startWorkout('Entrenamiento', []);
    }
  }, []);

  useEffect(() => {
    if (activeWorkout && !stopwatch.running) stopwatch.start();
  }, [activeWorkout]);

  if (!activeWorkout) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          border: '3px solid var(--border)', borderTop: '3px solid var(--primary)',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  const handleCompleteSet = (exIdx: number, setIdx: number) => {
    const set = activeWorkout.exercises[exIdx]?.sets[setIdx];
    if (!set) return;
    const nowCompleted = !set.completed;
    updateSet(exIdx, setIdx, { completed: nowCompleted });
    if (nowCompleted) {
      const restTime = activeWorkout.exercises[exIdx].restTime;
      countdown.startCountdown(restTime);
    }
  };

  const handleFinish = () => {
    const workout = finishWorkout();
    if (workout) navigate('/stats', { replace: true });
  };

  const completedSets = activeWorkout.exercises.reduce((a, ex) => a + ex.sets.filter(s => s.completed).length, 0);
  const totalSets = activeWorkout.exercises.reduce((a, ex) => a + ex.sets.length, 0);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '12px 16px',
      }}>
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowDiscard(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)', padding: '6px' }}
          >
            <X size={22} />
          </button>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1 }}>
              {activeWorkout.name}
            </p>
            <p style={{ fontSize: 22, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
              {stopwatch.format(stopwatch.elapsed)}
            </p>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowFinish(true)}
          >
            Finalizar
          </button>
        </div>

        {/* Progress bar */}
        <div className="progress-bar" style={{ marginTop: 8 }}>
          <div
            className="progress-fill"
            style={{ width: totalSets > 0 ? `${(completedSets / totalSets) * 100}%` : '0%' }}
          />
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginTop: 4 }}>
          {completedSets}/{totalSets} series completadas
        </p>
      </div>

      {/* Rest timer */}
      {countdown.running && (
        <div style={{
          background: 'var(--primary)', padding: '12px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div className="flex items-center gap-10">
            <Timer size={18} color="white" />
            <span style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>Descanso</span>
          </div>
          <span style={{
            color: 'white', fontSize: 24, fontWeight: 800, fontVariantNumeric: 'tabular-nums',
          }}>
            {countdown.format(countdown.remaining)}
          </span>
          <button
            onClick={countdown.stop}
            style={{
              background: 'rgba(255,255,255,0.2)', border: 'none',
              color: 'white', borderRadius: 8, padding: '6px 12px',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Saltar
          </button>
        </div>
      )}

      {/* Exercise list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        {activeWorkout.exercises.length === 0 && (
          <div className="empty-state" style={{ paddingTop: 60 }}>
            <span className="empty-icon">➕</span>
            <p className="empty-title">Sin ejercicios</p>
            <p className="empty-desc">Añade ejercicios desde la biblioteca</p>
          </div>
        )}

        {activeWorkout.exercises.map((we, exIdx) => {
          const isExpanded = expandedEx === we.id || expandedEx === null;
          return (
            <div key={we.id} className="card" style={{ marginBottom: 12, overflow: 'visible' }}>
              {/* Exercise header */}
              <div
                className="flex items-center justify-between"
                style={{ padding: '14px 16px', cursor: 'pointer' }}
                onClick={() => setExpandedEx(expandedEx === we.id ? null : we.id)}
              >
                <div>
                  <p style={{ fontSize: 16, fontWeight: 600 }}>{we.exercise.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
                    {we.sets.filter(s => s.completed).length}/{we.sets.length} series · Descanso {we.restTime}s
                  </p>
                </div>
                {isExpanded ? <ChevronUp size={18} color="var(--text-3)" /> : <ChevronDown size={18} color="var(--text-3)" />}
              </div>

              {isExpanded && (
                <div style={{ padding: '0 16px 16px' }}>
                  {/* Set column headers */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: '32px 1fr 1fr 36px',
                    gap: 8, marginBottom: 8,
                  }}>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center' }}>SET</span>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center' }}>KG</span>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center' }}>REPS</span>
                    <span />
                  </div>

                  {we.sets.map((set, setIdx) => (
                    <div
                      key={set.id}
                      style={{
                        display: 'grid', gridTemplateColumns: '32px 1fr 1fr 36px',
                        gap: 8, alignItems: 'center', marginBottom: 8,
                        opacity: set.completed ? 0.6 : 1,
                      }}
                    >
                      <span style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: set.completed ? 'var(--success-dim)' : 'var(--card)',
                        color: set.completed ? 'var(--success)' : 'var(--text-3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, border: '1.5px solid var(--border)',
                        margin: '0 auto',
                      }}>
                        {set.completed ? <Check size={14} /> : setIdx + 1}
                      </span>
                      <input
                        type="number"
                        inputMode="decimal"
                        className="set-input"
                        placeholder="—"
                        value={set.weight ?? ''}
                        onChange={e => updateSet(exIdx, setIdx, { weight: parseFloat(e.target.value) || undefined })}
                        style={set.completed ? { background: 'var(--success-dim)', borderColor: 'var(--success)' } : {}}
                      />
                      <input
                        type="number"
                        inputMode="numeric"
                        className="set-input"
                        placeholder="—"
                        value={set.reps ?? ''}
                        onChange={e => updateSet(exIdx, setIdx, { reps: parseInt(e.target.value) || undefined })}
                        style={set.completed ? { background: 'var(--success-dim)', borderColor: 'var(--success)' } : {}}
                      />
                      <button
                        onClick={() => handleCompleteSet(exIdx, setIdx)}
                        style={{
                          width: 32, height: 32, borderRadius: 8, border: 'none',
                          background: set.completed ? 'var(--success)' : 'var(--card)',
                          color: set.completed ? 'white' : 'var(--text-3)',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          outline: `1.5px solid ${set.completed ? 'var(--success)' : 'var(--border)'}`,
                        }}
                      >
                        <Check size={16} />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => addSet(exIdx)}
                    className="btn btn-ghost btn-full btn-sm"
                    style={{ marginTop: 4 }}
                  >
                    <Plus size={16} /> Añadir Serie
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Add exercise button */}
        <button
          onClick={() => navigate('/exercises')}
          className="btn btn-secondary btn-full"
          style={{ marginBottom: 24 }}
        >
          <Plus size={18} /> Añadir Ejercicio
        </button>
      </div>

      {/* Finish workout overlay */}
      {showFinish && (
        <div className="overlay overlay-center" onClick={() => setShowFinish(false)}>
          <div
            className="card"
            style={{ margin: 20, padding: 24, width: '100%', maxWidth: 360 }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <CheckCircle size={48} color="var(--success)" style={{ marginBottom: 12 }} />
              <h3 style={{ fontSize: 20, marginBottom: 8 }}>¿Terminar entrenamiento?</h3>
              <p style={{ color: 'var(--text-2)', fontSize: 14 }}>
                {stopwatch.format(stopwatch.elapsed)} · {completedSets} series completadas
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost btn-full" onClick={() => setShowFinish(false)}>
                Continuar
              </button>
              <button className="btn btn-primary btn-full" onClick={handleFinish}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discard overlay */}
      {showDiscard && (
        <div className="overlay overlay-center" onClick={() => setShowDiscard(false)}>
          <div
            className="card"
            style={{ margin: 20, padding: 24, width: '100%', maxWidth: 360 }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>¿Descartar entrenamiento?</h3>
            <p style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 20 }}>
              Se perderán todos los datos de esta sesión.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost btn-full" onClick={() => setShowDiscard(false)}>
                Cancelar
              </button>
              <button
                className="btn btn-danger btn-full"
                onClick={() => { discardWorkout(); navigate(-1); }}
              >
                Descartar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
