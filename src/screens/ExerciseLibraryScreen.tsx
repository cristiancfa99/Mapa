import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { exercises, muscleGroups, equipmentLabels, difficultyLabels } from '../data/exercises';
import type { MuscleGroup } from '../types';

const MUSCLE_ICONS: Record<string, string> = {
  chest: '🫁', back: '🔙', shoulders: '💪', biceps: '💪',
  triceps: '💪', legs: '🦵', glutes: '🍑', core: '⚡',
  cardio: '❤️', full_body: '🏋️',
};

const DIFF_COLORS: Record<string, string> = {
  beginner: 'var(--success)', intermediate: 'var(--secondary)', advanced: 'var(--error)',
};

const MUSCLE_COLORS: Record<string, string> = {
  chest: '#EF4444', back: '#3B82F6', shoulders: '#8B5CF6', biceps: '#F97316',
  triceps: '#EC4899', legs: '#10B981', glutes: '#14B8A6', core: '#F59E0B',
  cardio: '#EF4444', full_body: '#6366F1',
};

export const ExerciseLibraryScreen: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery]   = useState('');
  const [muscle, setMuscle] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return exercises.filter(e => {
      const matchQuery = !query || e.name.toLowerCase().includes(query.toLowerCase());
      const matchMuscle = muscle === 'all' || e.muscleGroup === muscle;
      return matchQuery && matchMuscle;
    });
  }, [query, muscle]);

  return (
    <div className="screen anim-fade">
      {/* Search Header */}
      <div style={{ padding: '16px 16px 8px', position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 10 }}>
        <div className="flex items-center gap-10">
          <div className="search-bar" style={{ flex: 1 }}>
            <Search size={18} color="var(--text-3)" />
            <input
              className="search-input"
              placeholder="Buscar ejercicio..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && (
              <span
                onClick={() => setQuery('')}
                style={{ color: 'var(--text-3)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
              >
                ×
              </span>
            )}
          </div>
          <button
            className="btn-icon"
            onClick={() => setShowFilters(s => !s)}
            style={{
              background: showFilters ? 'var(--primary-dim)' : 'var(--card)',
              color: showFilters ? 'var(--primary)' : 'var(--text-2)',
            }}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Muscle Group Filter */}
      <div style={{ padding: '8px 0 12px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 8, padding: '0 16px', width: 'max-content' }}>
          {muscleGroups.map(mg => (
            <button
              key={mg.id}
              className={`chip ${muscle === mg.id ? 'active' : ''}`}
              onClick={() => setMuscle(mg.id)}
              style={muscle === mg.id ? {
                background: `${mg.color}20`,
                borderColor: mg.color,
                color: mg.color,
              } : {}}
            >
              {mg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div style={{ padding: '0 16px 12px' }}>
        <p style={{ fontSize: 13, color: 'var(--text-3)' }}>
          {filtered.length} ejercicio{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Exercise List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <p className="empty-title">Sin resultados</p>
          <p className="empty-desc">Intenta con otro término o cambia los filtros</p>
        </div>
      ) : (
        <div className="card" style={{ margin: '0 16px 24px', overflow: 'hidden' }}>
          {filtered.map((ex, i) => (
            <div
              key={ex.id}
              className="list-item"
              onClick={() => navigate(`/exercises/${ex.id}`)}
              style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}
            >
              {/* Icon */}
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: `${MUSCLE_COLORS[ex.muscleGroup] ?? 'var(--primary)'}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>
                {MUSCLE_ICONS[ex.muscleGroup] ?? '🏋️'}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)', marginBottom: 4 }}>
                  {ex.name}
                </p>
                <div className="flex items-center gap-8" style={{ flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: `${MUSCLE_COLORS[ex.muscleGroup] ?? 'var(--primary)'}20`,
                    color: MUSCLE_COLORS[ex.muscleGroup] ?? 'var(--primary)',
                  }}>
                    {muscleGroups.find(mg => mg.id === ex.muscleGroup)?.label}
                  </span>
                  <span style={{ fontSize: 11, color: DIFF_COLORS[ex.difficulty] ?? 'var(--text-3)', fontWeight: 500 }}>
                    {difficultyLabels[ex.difficulty]}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
                    {equipmentLabels[ex.equipment]}
                  </span>
                </div>
              </div>

              <ChevronRight size={16} color="var(--text-3)" style={{ flexShrink: 0 }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
