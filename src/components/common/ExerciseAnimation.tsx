import React from 'react';

type MovementType =
  | 'push_h' | 'push_v' | 'pull_v' | 'pull_h'
  | 'squat' | 'hinge' | 'curl' | 'extension'
  | 'raise' | 'plank' | 'cardio' | 'hip_thrust';

interface Props { type: MovementType; color: string; }

/* Map exercise IDs → movement type */
export const MOVEMENT_MAP: Record<string, MovementType> = {
  'bench-press': 'push_h', 'incline-bench': 'push_h', 'dumbbell-press': 'push_h',
  'decline-bench': 'push_h', 'close-grip-bench': 'push_h', 'chest-dips': 'push_h',
  'push-up': 'push_h', 'pec-deck': 'push_h', 'cable-fly': 'push_h',
  'overhead-press': 'push_v', 'arnold-press': 'push_v',
  'pull-up': 'pull_v', 'chin-up': 'pull_v', 'lat-pulldown': 'pull_v',
  'bent-over-row': 'pull_h', 'seated-cable-row': 'pull_h', 'single-arm-row': 'pull_h',
  't-bar-row': 'pull_h', 'face-pull': 'pull_h',
  'deadlift': 'hinge', 'romanian-deadlift': 'hinge', 'rack-pull': 'hinge',
  'sumo-deadlift': 'hinge', 'good-morning': 'hinge',
  'back-squat': 'squat', 'front-squat': 'squat', 'goblet-squat': 'squat',
  'hack-squat': 'squat', 'leg-press': 'squat', 'bulgarian-split-squat': 'squat',
  'lunge': 'squat',
  'barbell-curl': 'curl', 'dumbbell-curl': 'curl', 'hammer-curl': 'curl',
  'preacher-curl': 'curl', 'cable-curl': 'curl', 'concentration-curl': 'curl',
  'tricep-pushdown': 'extension', 'skull-crusher': 'extension',
  'overhead-tricep': 'extension', 'tricep-dips': 'extension',
  'lateral-raise': 'raise', 'front-raise': 'raise', 'rear-delt-fly': 'raise',
  'upright-row': 'raise',
  'hip-thrust': 'hip_thrust', 'glute-bridge': 'hip_thrust',
  'plank': 'plank', 'side-plank': 'plank', 'dead-bug': 'plank',
  'running': 'cardio', 'jump-rope': 'cardio', 'burpees': 'cardio',
  'box-jump': 'cardio', 'mountain-climber': 'cardio', 'rowing-machine': 'pull_h',
  'leg-curl': 'curl', 'leg-extension': 'extension', 'calf-raise': 'raise',
  'cable-crunch': 'pull_v', 'ab-wheel': 'push_h', 'russian-twist': 'push_h',
  'hanging-leg-raise': 'pull_v', 'cable-kickback': 'extension',
};

/* ───── Individual animations ───── */

const PushH: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 200 120" width="100%" style={{ maxHeight: 120 }}>
    <style>{`
      @keyframes barH { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-28px)} }
      @keyframes armH { 0%,100%{d:path("M70 90 L100 80")} 50%{d:path("M70 90 L100 52")} }
      @keyframes chestH{ 0%,100%{transform:scaleX(1)} 50%{transform:scaleX(0.85)} }
      .bar-anim { animation: barH 2s ease-in-out infinite; transform-origin: 100px 80px; }
      .arm-anim { animation: barH 2s ease-in-out infinite; transform-origin: 70px 90px; }
    `}</style>
    {/* Bench */}
    <rect x="20" y="92" width="160" height="14" rx="4" fill="var(--border)" />
    {/* Body on bench */}
    <ellipse cx="100" cy="88" rx="60" ry="10" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1.5" />
    {/* Barbell */}
    <g className="bar-anim">
      <rect x="20" y="52" width="160" height="8" rx="4" fill={color} opacity="0.9" />
      <circle cx="20" cy="56" r="10" fill={color} opacity="0.7" />
      <circle cx="180" cy="56" r="10" fill={color} opacity="0.7" />
    </g>
    {/* Arms */}
    <g className="arm-anim">
      <line x1="72" y1="87" x2="72" y2="58" stroke="var(--text-2)" strokeWidth="5" strokeLinecap="round" />
      <line x1="128" y1="87" x2="128" y2="58" stroke="var(--text-2)" strokeWidth="5" strokeLinecap="round" />
    </g>
    {/* Labels */}
    <text x="100" y="115" textAnchor="middle" fontSize="10" fill="var(--text-3)">EMPUJE HORIZONTAL</text>
  </svg>
);

const PushV: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 200 140" width="100%" style={{ maxHeight: 140 }}>
    <style>{`
      @keyframes barV { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-32px)} }
      .barV-anim { animation: barV 2s ease-in-out infinite; transform-origin: 100px 70px; }
    `}</style>
    {/* Standing person */}
    <circle cx="100" cy="28" r="14" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1.5" />
    <rect x="88" y="44" width="24" height="36" rx="4" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1.5" />
    {/* Legs */}
    <line x1="95" y1="80" x2="85" y2="118" stroke="var(--border-light)" strokeWidth="5" strokeLinecap="round" />
    <line x1="105" y1="80" x2="115" y2="118" stroke="var(--border-light)" strokeWidth="5" strokeLinecap="round" />
    {/* Barbell */}
    <g className="barV-anim">
      <rect x="24" y="62" width="152" height="8" rx="4" fill={color} opacity="0.9" />
      <circle cx="24" cy="66" r="10" fill={color} opacity="0.7" />
      <circle cx="176" cy="66" r="10" fill={color} opacity="0.7" />
      {/* Arms */}
      <line x1="76" y1="62" x2="88" y2="62" stroke="var(--text-2)" strokeWidth="5" strokeLinecap="round" />
      <line x1="124" y1="62" x2="112" y2="62" stroke="var(--text-2)" strokeWidth="5" strokeLinecap="round" />
    </g>
    <text x="100" y="133" textAnchor="middle" fontSize="10" fill="var(--text-3)">EMPUJE VERTICAL</text>
  </svg>
);

const PullV: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 200 150" width="100%" style={{ maxHeight: 150 }}>
    <style>{`
      @keyframes pullV { 0%,100%{transform:translateY(0)} 50%{transform:translateY(32px)} }
      .pullV-anim { animation: pullV 2s ease-in-out infinite; transform-origin: 100px 80px; }
    `}</style>
    {/* Bar at top */}
    <rect x="20" y="18" width="160" height="10" rx="5" fill="var(--border-light)" />
    <rect x="30" y="10" width="10" height="10" rx="2" fill="var(--border)" />
    <rect x="160" y="10" width="10" height="10" rx="2" fill="var(--border)" />
    {/* Hanging body */}
    <g className="pullV-anim">
      <circle cx="100" cy="54" r="14" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1.5" />
      <rect x="88" y="70" width="24" height="34" rx="4" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1.5" />
      {/* Arms */}
      <line x1="100" y1="28" x2="76" y2="52" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.9" />
      <line x1="100" y1="28" x2="124" y2="52" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.9" />
      {/* Legs */}
      <line x1="95" y1="104" x2="88" y2="134" stroke="var(--border-light)" strokeWidth="4" strokeLinecap="round" />
      <line x1="105" y1="104" x2="112" y2="134" stroke="var(--border-light)" strokeWidth="4" strokeLinecap="round" />
    </g>
    <text x="100" y="148" textAnchor="middle" fontSize="10" fill="var(--text-3)">JALÓN VERTICAL</text>
  </svg>
);

const PullH: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 200 130" width="100%" style={{ maxHeight: 130 }}>
    <style>{`
      @keyframes pullH { 0%,100%{transform:translateX(0)} 50%{transform:translateX(-22px)} }
      .pullH-anim { animation: pullH 2s ease-in-out infinite; transform-origin: 130px 60px; }
    `}</style>
    {/* Seated person */}
    <ellipse cx="40" cy="88" rx="18" ry="8" fill="var(--border)" />
    <circle cx="40" cy="52" r="13" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1.5" />
    <rect x="30" y="65" width="20" height="28" rx="4" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1.5" />
    {/* Cable machine */}
    <rect x="168" y="20" width="14" height="88" rx="4" fill="var(--border)" />
    <circle cx="175" cy="62" r="8" fill="var(--border-light)" />
    {/* Cable + handle */}
    <g className="pullH-anim">
      <line x1="56" y1="65" x2="167" y2="62" stroke={color} strokeWidth="2.5" strokeDasharray="4,3" opacity="0.8" />
      <rect x="155" y="55" width="12" height="14" rx="3" fill={color} opacity="0.9" />
      {/* Arm */}
      <line x1="50" y1="68" x2="155" y2="62" stroke="var(--text-2)" strokeWidth="5" strokeLinecap="round" />
    </g>
    <text x="100" y="118" textAnchor="middle" fontSize="10" fill="var(--text-3)">REMO HORIZONTAL</text>
  </svg>
);

const Squat: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 200 160" width="100%" style={{ maxHeight: 160 }}>
    <style>{`
      @keyframes squat {
        0%,100%{transform:translateY(0)}
        50%{transform:translateY(28px)}
      }
      .squat-body { animation: squat 2s ease-in-out infinite; transform-origin: 100px 60px; }
    `}</style>
    {/* Floor */}
    <rect x="20" y="148" width="160" height="6" rx="3" fill="var(--border)" />
    {/* Barbell on back */}
    <rect x="38" y="56" width="124" height="8" rx="4" fill={color} opacity="0.9" />
    <circle cx="38" cy="60" r="9" fill={color} opacity="0.7" />
    <circle cx="162" cy="60" r="9" fill={color} opacity="0.7" />
    {/* Body */}
    <g className="squat-body">
      <circle cx="100" cy="38" r="13" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1.5" />
      <rect x="88" y="53" width="24" height="30" rx="4" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1.5" />
      {/* Thighs */}
      <line x1="92" y1="83" x2="76" y2="116" stroke="var(--text-2)" strokeWidth="7" strokeLinecap="round" />
      <line x1="108" y1="83" x2="124" y2="116" stroke="var(--text-2)" strokeWidth="7" strokeLinecap="round" />
      {/* Shins */}
      <line x1="76" y1="116" x2="80" y2="148" stroke="var(--border-light)" strokeWidth="6" strokeLinecap="round" />
      <line x1="124" y1="116" x2="120" y2="148" stroke="var(--border-light)" strokeWidth="6" strokeLinecap="round" />
    </g>
    <text x="100" y="158" textAnchor="middle" fontSize="10" fill="var(--text-3)">SENTADILLA / SQUAT</text>
  </svg>
);

const Hinge: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 200 160" width="100%" style={{ maxHeight: 160 }}>
    <style>{`
      @keyframes hinge {
        0%,100%{transform:rotate(0deg)}
        50%{transform:rotate(40deg)}
      }
      .hinge-torso { animation: hinge 2s ease-in-out infinite; transform-origin: 90px 104px; }
    `}</style>
    {/* Floor */}
    <rect x="20" y="148" width="160" height="6" rx="3" fill="var(--border)" />
    {/* Legs (static) */}
    <line x1="80" y1="104" x2="75" y2="148" stroke="var(--border-light)" strokeWidth="7" strokeLinecap="round" />
    <line x1="100" y1="104" x2="105" y2="148" stroke="var(--border-light)" strokeWidth="7" strokeLinecap="round" />
    {/* Hinged torso */}
    <g className="hinge-torso">
      <rect x="68" y="78" width="24" height="28" rx="4" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1.5" />
      <circle cx="80" cy="64" r="13" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1.5" />
      {/* Barbell */}
      <rect x="20" y="102" width="110" height="8" rx="4" fill={color} opacity="0.9" />
      <circle cx="20" cy="106" r="9" fill={color} opacity="0.7" />
      {/* Arms */}
      <line x1="72" y1="100" x2="40" y2="106" stroke="var(--text-2)" strokeWidth="5" strokeLinecap="round" />
      <line x1="90" y1="100" x2="110" y2="106" stroke="var(--text-2)" strokeWidth="5" strokeLinecap="round" />
    </g>
    <text x="100" y="158" textAnchor="middle" fontSize="10" fill="var(--text-3)">BISAGRA DE CADERA</text>
  </svg>
);

const Curl: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 200 150" width="100%" style={{ maxHeight: 150 }}>
    <style>{`
      @keyframes curl {
        0%,100%{transform:rotate(0deg)}
        50%{transform:rotate(-105deg)}
      }
      .curl-arm { animation: curl 2s ease-in-out infinite; transform-origin: 110px 85px; }
    `}</style>
    {/* Person torso */}
    <circle cx="100" cy="36" r="14" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1.5" />
    <rect x="86" y="52" width="28" height="38" rx="5" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1.5" />
    {/* Static arm */}
    <line x1="86" y1="64" x2="64" y2="118" stroke="var(--border-light)" strokeWidth="7" strokeLinecap="round" />
    {/* Animated arm */}
    <g className="curl-arm">
      <line x1="110" y1="85" x2="110" y2="130" stroke={color} strokeWidth="7" strokeLinecap="round" opacity="0.9" />
      {/* Weight */}
      <circle cx="110" cy="135" r="10" fill={color} opacity="0.8" />
    </g>
    <text x="100" y="148" textAnchor="middle" fontSize="10" fill="var(--text-3)">CURL / FLEXIÓN</text>
  </svg>
);

const Extension: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 200 150" width="100%" style={{ maxHeight: 150 }}>
    <style>{`
      @keyframes ext {
        0%,100%{transform:rotate(0deg)}
        50%{transform:rotate(80deg)}
      }
      .ext-arm { animation: ext 2s ease-in-out infinite; transform-origin: 100px 68px; }
    `}</style>
    <circle cx="100" cy="36" r="14" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1.5" />
    <rect x="86" y="52" width="28" height="38" rx="5" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1.5" />
    <line x1="114" y1="64" x2="136" y2="120" stroke="var(--border-light)" strokeWidth="7" strokeLinecap="round" />
    <g className="ext-arm">
      <line x1="100" y1="68" x2="100" y2="120" stroke={color} strokeWidth="7" strokeLinecap="round" opacity="0.9" />
      <circle cx="100" cy="124" r="10" fill={color} opacity="0.8" />
    </g>
    <text x="100" y="146" textAnchor="middle" fontSize="10" fill="var(--text-3)">EXTENSIÓN</text>
  </svg>
);

const Raise: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 200 150" width="100%" style={{ maxHeight: 150 }}>
    <style>{`
      @keyframes raise {
        0%,100%{transform:rotate(0deg)}
        50%{transform:rotate(-70deg)}
      }
      .raise-L { animation: raise 2s ease-in-out infinite; transform-origin: 78px 72px; }
      .raise-R { animation: raise 2s ease-in-out infinite; transform-origin: 122px 72px; transform:scaleX(-1); }
    `}</style>
    <circle cx="100" cy="36" r="14" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1.5" />
    <rect x="86" y="52" width="28" height="52" rx="5" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1.5" />
    <g className="raise-L">
      <line x1="78" y1="72" x2="44" y2="110" stroke={color} strokeWidth="6" strokeLinecap="round" opacity="0.9" />
      <circle cx="40" cy="113" r="9" fill={color} opacity="0.8" />
    </g>
    <g style={{ transform: 'scaleX(-1)', transformOrigin: '100px 72px' }}>
      <g className="raise-L">
        <line x1="78" y1="72" x2="44" y2="110" stroke={color} strokeWidth="6" strokeLinecap="round" opacity="0.9" />
        <circle cx="40" cy="113" r="9" fill={color} opacity="0.8" />
      </g>
    </g>
    <text x="100" y="144" textAnchor="middle" fontSize="10" fill="var(--text-3)">ELEVACIÓN</text>
  </svg>
);

const HipThrust: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 200 130" width="100%" style={{ maxHeight: 130 }}>
    <style>{`
      @keyframes hip {
        0%,100%{transform:translateY(0) rotate(0deg)}
        50%{transform:translateY(-24px) rotate(-12deg)}
      }
      .hip-body { animation: hip 2s ease-in-out infinite; transform-origin: 100px 90px; }
    `}</style>
    {/* Bench */}
    <rect x="16" y="76" width="55" height="18" rx="5" fill="var(--border)" />
    {/* Floor */}
    <rect x="20" y="122" width="160" height="6" rx="3" fill="var(--border)" />
    <g className="hip-body">
      {/* Upper back on bench */}
      <rect x="24" y="62" width="40" height="18" rx="4" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1.5" />
      {/* Head */}
      <circle cx="26" cy="54" r="12" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1.5" />
      {/* Hips / glutes */}
      <ellipse cx="92" cy="74" rx="20" ry="14" fill={color} opacity="0.85" />
      {/* Barbell */}
      <rect x="64" y="64" width="90" height="8" rx="4" fill={color} opacity="0.6" />
      {/* Thighs */}
      <line x1="72" y1="84" x2="72" y2="120" stroke="var(--text-2)" strokeWidth="7" strokeLinecap="round" />
      <line x1="106" y1="84" x2="116" y2="120" stroke="var(--text-2)" strokeWidth="7" strokeLinecap="round" />
    </g>
    <text x="100" y="130" textAnchor="middle" fontSize="10" fill="var(--text-3)">HIP THRUST / GLÚTEO</text>
  </svg>
);

const Plank: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 200 100" width="100%" style={{ maxHeight: 100 }}>
    <style>{`
      @keyframes plk { 0%,100%{opacity:1} 50%{opacity:0.5} }
      .plk-core { animation: plk 2s ease-in-out infinite; }
    `}</style>
    <rect x="20" y="88" width="160" height="6" rx="3" fill="var(--border)" />
    {/* Body in plank */}
    <circle cx="164" cy="60" r="13" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1.5" />
    <rect x="60" y="63" width="104" height="16" rx="6" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1.5" />
    {/* Core highlight */}
    <rect x="88" y="64" width="48" height="14" rx="5" fill={color} opacity="0.7" className="plk-core" />
    {/* Arms */}
    <line x1="62" y1="70" x2="38" y2="88" stroke="var(--border-light)" strokeWidth="6" strokeLinecap="round" />
    <line x1="74" y1="79" x2="52" y2="88" stroke="var(--border-light)" strokeWidth="6" strokeLinecap="round" />
    {/* Feet */}
    <line x1="60" y1="78" x2="38" y2="88" stroke="var(--border-light)" strokeWidth="6" strokeLinecap="round" />
    <text x="100" y="100" textAnchor="middle" fontSize="10" fill="var(--text-3)">ESTABILIZACIÓN / ISOMÉTRICO</text>
  </svg>
);

const Cardio: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 200 130" width="100%" style={{ maxHeight: 130 }}>
    <style>{`
      @keyframes run {
        0%  { transform: translateX(0) }
        100%{ transform: translateX(0) }
        25% { transform: translateX(10px) }
        75% { transform: translateX(-10px) }
      }
      @keyframes legF { 0%,100%{transform:rotate(-20deg)} 50%{transform:rotate(40deg)} }
      @keyframes legB { 0%,100%{transform:rotate(20deg)} 50%{transform:rotate(-40deg)} }
      @keyframes armF { 0%,100%{transform:rotate(30deg)} 50%{transform:rotate(-30deg)} }
      .legF { animation: legF 0.7s ease-in-out infinite; transform-origin: 100px 80px; }
      .legB { animation: legB 0.7s ease-in-out infinite; transform-origin: 100px 80px; }
      .armF { animation: armF 0.7s ease-in-out infinite; transform-origin: 100px 62px; }
      .armB { animation: armF 0.7s ease-in-out infinite reverse; transform-origin: 100px 62px; }
    `}</style>
    {/* Ground */}
    <rect x="20" y="118" width="160" height="5" rx="2" fill="var(--border)" />
    {/* Runner */}
    <circle cx="100" cy="36" r="14" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1.5" />
    <rect x="88" y="52" width="24" height="30" rx="5" fill="var(--card)" stroke="var(--border-light)" strokeWidth="1.5" />
    {/* Legs */}
    <g className="legF">
      <line x1="100" y1="80" x2="88" y2="118" stroke={color} strokeWidth="7" strokeLinecap="round" opacity="0.9" />
    </g>
    <g className="legB">
      <line x1="100" y1="80" x2="112" y2="118" stroke="var(--border-light)" strokeWidth="7" strokeLinecap="round" />
    </g>
    {/* Arms */}
    <g className="armF">
      <line x1="88" y1="62" x2="70" y2="90" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.9" />
    </g>
    <g className="armB">
      <line x1="112" y1="62" x2="130" y2="90" stroke="var(--border-light)" strokeWidth="5" strokeLinecap="round" />
    </g>
    <text x="100" y="128" textAnchor="middle" fontSize="10" fill="var(--text-3)">EJERCICIO CARDIOVASCULAR</text>
  </svg>
);

export const ExerciseAnimation: React.FC<Props> = ({ type, color }) => {
  const props = { color };
  const map: Record<MovementType, React.ReactNode> = {
    push_h:    <PushH {...props} />,
    push_v:    <PushV {...props} />,
    pull_v:    <PullV {...props} />,
    pull_h:    <PullH {...props} />,
    squat:     <Squat {...props} />,
    hinge:     <Hinge {...props} />,
    curl:      <Curl {...props} />,
    extension: <Extension {...props} />,
    raise:     <Raise {...props} />,
    hip_thrust:<HipThrust {...props} />,
    plank:     <Plank {...props} />,
    cardio:    <Cardio {...props} />,
  };
  return <div style={{ padding: '12px 0' }}>{map[type]}</div>;
};
