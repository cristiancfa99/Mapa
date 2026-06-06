import React from 'react';
import type { MuscleGroup } from '../../types';

interface Props {
  primary: MuscleGroup;
  secondary: MuscleGroup[];
}

const COLOR: Record<string, string> = {
  chest: '#EF4444', back: '#3B82F6', shoulders: '#8B5CF6',
  biceps: '#F97316', triceps: '#EC4899', legs: '#10B981',
  glutes: '#14B8A6', core: '#F59E0B', cardio: '#EF4444', full_body: '#6366F1',
};

function muscleFill(muscle: MuscleGroup, primary: MuscleGroup, secondary: MuscleGroup[]): string {
  if (muscle === primary) return COLOR[muscle] ?? '#6366F1';
  if (secondary.includes(muscle)) return `${COLOR[muscle] ?? '#888'}80`;
  return 'var(--border)';
}

function muscleOpacity(muscle: MuscleGroup, primary: MuscleGroup, secondary: MuscleGroup[]): number {
  if (muscle === primary) return 1;
  if (secondary.includes(muscle)) return 0.6;
  return 0.25;
}

/* ──────────────────────────────────────────────────────── */
/* Front body SVG                                           */
/* ──────────────────────────────────────────────────────── */
const FrontBody: React.FC<Props> = ({ primary, secondary }) => {
  const f = (m: MuscleGroup) => muscleFill(m, primary, secondary);
  const o = (m: MuscleGroup) => muscleOpacity(m, primary, secondary);

  return (
    <svg viewBox="0 0 120 280" width="120" height="280" xmlns="http://www.w3.org/2000/svg">
      {/* ── Head ── */}
      <ellipse cx="60" cy="20" rx="16" ry="18" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1.5" />
      {/* ── Neck ── */}
      <rect x="54" y="34" width="12" height="10" rx="3" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1" />

      {/* ── Shoulders ── */}
      <ellipse cx="27" cy="62" rx="14" ry="10" fill={f('shoulders')} opacity={o('shoulders')} />
      <ellipse cx="93" cy="62" rx="14" ry="10" fill={f('shoulders')} opacity={o('shoulders')} />

      {/* ── Chest ── */}
      <path d="M38 50 Q60 46 82 50 L82 82 Q60 88 38 82 Z" fill={f('chest')} opacity={o('chest')} rx="4" />

      {/* ── Back (trapezius upper) ── */}
      <path d="M42 44 Q60 40 78 44 L78 52 Q60 48 42 52 Z" fill={f('back')} opacity={o('back')} />

      {/* ── Upper Arms left (biceps front, triceps back) ── */}
      <ellipse cx="22" cy="93" rx="9" ry="26" fill={f('biceps')} opacity={o('biceps')} />
      {/* ── Upper Arms right ── */}
      <ellipse cx="98" cy="93" rx="9" ry="26" fill={f('biceps')} opacity={o('biceps')} />

      {/* ── Triceps overlap ── */}
      <ellipse cx="20" cy="100" rx="7" ry="18" fill={f('triceps')} opacity={o('triceps') * 0.6} />
      <ellipse cx="100" cy="100" rx="7" ry="18" fill={f('triceps')} opacity={o('triceps') * 0.6} />

      {/* ── Forearms ── */}
      <ellipse cx="18" cy="130" rx="7" ry="18" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1" />
      <ellipse cx="102" cy="130" rx="7" ry="18" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1" />

      {/* ── Core / Abs ── */}
      <rect x="40" y="84" width="40" height="46" rx="6" fill={f('core')} opacity={o('core')} />
      {/* Abs lines */}
      {o('core') > 0.3 && <>
        <line x1="60" y1="88" x2="60" y2="128" stroke="var(--surface)" strokeWidth="1.5" opacity="0.4" />
        <line x1="42" y1="102" x2="78" y2="102" stroke="var(--surface)" strokeWidth="1" opacity="0.3" />
        <line x1="42" y1="115" x2="78" y2="115" stroke="var(--surface)" strokeWidth="1" opacity="0.3" />
      </>}

      {/* ── Hip / Glutes (front visible part) ── */}
      <path d="M38 130 Q60 126 82 130 L84 148 Q60 152 36 148 Z" fill={f('glutes')} opacity={o('glutes') * 0.5} />

      {/* ── Quads / Legs ── */}
      <ellipse cx="48" cy="192" rx="16" ry="48" fill={f('legs')} opacity={o('legs')} />
      <ellipse cx="72" cy="192" rx="16" ry="48" fill={f('legs')} opacity={o('legs')} />

      {/* ── Calves ── */}
      <ellipse cx="47" cy="248" rx="11" ry="22" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1" />
      <ellipse cx="73" cy="248" rx="11" ry="22" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1" />
    </svg>
  );
};

/* ──────────────────────────────────────────────────────── */
/* Back body SVG                                            */
/* ──────────────────────────────────────────────────────── */
const BackBody: React.FC<Props> = ({ primary, secondary }) => {
  const f = (m: MuscleGroup) => muscleFill(m, primary, secondary);
  const o = (m: MuscleGroup) => muscleOpacity(m, primary, secondary);

  return (
    <svg viewBox="0 0 120 280" width="120" height="280" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <ellipse cx="60" cy="20" rx="16" ry="18" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1.5" />
      {/* Neck */}
      <rect x="54" y="34" width="12" height="10" rx="3" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1" />

      {/* ── Traps / Upper Back ── */}
      <path d="M36 44 Q60 38 84 44 L82 68 Q60 64 38 68 Z" fill={f('back')} opacity={o('back')} />

      {/* ── Shoulders rear ── */}
      <ellipse cx="27" cy="62" rx="14" ry="10" fill={f('shoulders')} opacity={o('shoulders') * 0.7} />
      <ellipse cx="93" cy="62" rx="14" ry="10" fill={f('shoulders')} opacity={o('shoulders') * 0.7} />

      {/* ── Lats ── */}
      <path d="M38 68 Q28 90 32 120 L48 120 Q44 90 50 72 Z" fill={f('back')} opacity={o('back')} />
      <path d="M82 68 Q92 90 88 120 L72 120 Q76 90 70 72 Z" fill={f('back')} opacity={o('back')} />

      {/* ── Triceps rear ── */}
      <ellipse cx="22" cy="93" rx="9" ry="26" fill={f('triceps')} opacity={o('triceps')} />
      <ellipse cx="98" cy="93" rx="9" ry="26" fill={f('triceps')} opacity={o('triceps')} />

      {/* ── Forearms ── */}
      <ellipse cx="18" cy="130" rx="7" ry="18" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1" />
      <ellipse cx="102" cy="130" rx="7" ry="18" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1" />

      {/* ── Lower Back ── */}
      <rect x="38" y="118" width="44" height="32" rx="5" fill={f('back')} opacity={o('back') * 0.7} />

      {/* ── Glutes ── */}
      <path d="M36 148 Q60 144 84 148 L86 178 Q60 184 34 178 Z" fill={f('glutes')} opacity={o('glutes')} />

      {/* ── Hamstrings ── */}
      <ellipse cx="48" cy="210" rx="16" ry="40" fill={f('legs')} opacity={o('legs')} />
      <ellipse cx="72" cy="210" rx="16" ry="40" fill={f('legs')} opacity={o('legs')} />

      {/* ── Calves ── */}
      <ellipse cx="47" cy="252" rx="11" ry="22" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1" />
      <ellipse cx="73" cy="252" rx="11" ry="22" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1" />
    </svg>
  );
};

/* ──────────────────────────────────────────────────────── */
/* Exported component                                       */
/* ──────────────────────────────────────────────────────── */
const SHOW_BACK: MuscleGroup[] = ['back', 'glutes', 'triceps'];

export const MuscleMap: React.FC<Props> = ({ primary, secondary }) => {
  const showBack = SHOW_BACK.includes(primary) || secondary.some(m => SHOW_BACK.includes(m));

  return (
    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'flex-start' }}>
      <div style={{ textAlign: 'center' }}>
        <FrontBody primary={primary} secondary={secondary} />
        <p style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 4 }}>FRENTE</p>
      </div>
      {showBack && (
        <div style={{ textAlign: 'center' }}>
          <BackBody primary={primary} secondary={secondary} />
          <p style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 4 }}>ESPALDA</p>
        </div>
      )}
    </div>
  );
};
