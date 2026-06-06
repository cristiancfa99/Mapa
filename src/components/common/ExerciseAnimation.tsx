import React from 'react';

export type MovementType =
  | 'push_h' | 'push_v' | 'pull_v' | 'pull_h'
  | 'squat' | 'hinge' | 'curl' | 'extension'
  | 'raise' | 'plank' | 'cardio' | 'hip_thrust';

interface Props { type: MovementType; color: string; }

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

/* ─── Shared tokens ──────────────────────────────────────────── */
const T  = 'var(--text-2)';
const SK = 'var(--card)';
const EQ = 'var(--border)';

/* Joint dot */
const J: React.FC<{x:number; y:number; r?:number; c?:string}> = ({x,y,r=4.5,c}) =>
  <circle cx={x} cy={y} r={r} fill={c ?? SK} stroke={T} strokeWidth="1.5" />;

/* Label */
const Lbl: React.FC<{text:string}> = ({text}) => (
  <text x="100" y="192" textAnchor="middle" fontSize="9" fill="var(--text-3)"
    fontFamily="system-ui,sans-serif" fontWeight="700" letterSpacing="0.8">
    {text}
  </text>
);

/* ══════════════════════════════════════════════════════════════
   PRESS DE BANCA  —  vista lateral
   Person lying on bench. Bar goes up (arms extend) then down.
   ══════════════════════════════════════════════════════════════ */
const PushH: React.FC<{color:string}> = ({color}) => (
  <svg viewBox="0 0 200 196" width="100%">
    <style>{`
      @keyframes ph { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-30px)} }
      .ph { animation: ph 2.3s cubic-bezier(.37,0,.63,1) infinite; }
    `}</style>

    {/* Bench */}
    <rect x="8"  y="106" width="182" height="14" rx="6" fill={EQ} />
    <rect x="24" y="120" width="10"  height="26" rx="4" fill={EQ} />
    <rect x="166" y="120" width="10" height="26" rx="4" fill={EQ} />

    {/* ─── Static body ─── */}
    {/* Head */}
    <circle cx="22" cy="88" r="14" fill={SK} stroke={T} strokeWidth="2"/>
    {/* Neck */}
    <line x1="22" y1="102" x2="36" y2="102" stroke={T} strokeWidth="4" strokeLinecap="round"/>
    {/* Torso */}
    <rect x="36" y="90" width="98" height="17" rx="7" fill={SK} stroke={T} strokeWidth="2"/>
    {/* Thigh */}
    <line x1="134" y1="98" x2="160" y2="97" stroke={T} strokeWidth="10" strokeLinecap="round"/>
    {/* Knee */}
    <J x={160} y={97} r={5}/>
    {/* Shin */}
    <line x1="160" y1="97" x2="170" y2="112" stroke={T} strokeWidth="8" strokeLinecap="round"/>
    {/* Foot */}
    <line x1="170" y1="112" x2="186" y2="112" stroke={T} strokeWidth="6" strokeLinecap="round"/>

    {/* ─── Animated: arms + barbell ─── */}
    <g className="ph">
      {/* Left upper arm */}
      <line x1="62" y1="98" x2="60" y2="72" stroke={T} strokeWidth="9" strokeLinecap="round"/>
      <J x={60} y={72}/>
      {/* Left forearm */}
      <line x1="60" y1="72" x2="66" y2="55" stroke={color} strokeWidth="7" strokeLinecap="round"/>
      {/* Right upper arm */}
      <line x1="110" y1="98" x2="112" y2="72" stroke={T} strokeWidth="9" strokeLinecap="round"/>
      <J x={112} y={72}/>
      {/* Right forearm */}
      <line x1="112" y1="72" x2="106" y2="55" stroke={color} strokeWidth="7" strokeLinecap="round"/>
      {/* Bar shaft */}
      <rect x="10" y="50" width="178" height="7" rx="3.5" fill={color}/>
      {/* Plates L */}
      <rect x="8"  y="38" width="8"  height="31" rx="3" fill={color} opacity=".75"/>
      <rect x="19" y="42" width="6"  height="23" rx="2" fill={color} opacity=".5"/>
      {/* Plates R */}
      <rect x="184" y="38" width="8" height="31" rx="3" fill={color} opacity=".75"/>
      <rect x="175" y="42" width="6" height="23" rx="2" fill={color} opacity=".5"/>
      {/* Knurling */}
      <rect x="56" y="51" width="86" height="5" rx="2" fill={color} opacity=".45"/>
    </g>

    <Lbl text="PRESS DE BANCA"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   PRESS MILITAR  —  vista frontal
   Person stands. Bar travels from shoulders to overhead.
   ══════════════════════════════════════════════════════════════ */
const PushV: React.FC<{color:string}> = ({color}) => (
  <svg viewBox="0 0 200 196" width="100%">
    <style>{`
      @keyframes pv { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-36px)} }
      .pv { animation: pv 2.3s cubic-bezier(.37,0,.63,1) infinite; }
    `}</style>

    {/* Floor */}
    <rect x="30" y="178" width="140" height="6" rx="3" fill={EQ}/>

    {/* Head */}
    <circle cx="100" cy="22" r="14" fill={SK} stroke={T} strokeWidth="2"/>
    {/* Torso */}
    <line x1="100" y1="37" x2="100" y2="96" stroke={T} strokeWidth="10" strokeLinecap="round"/>
    {/* Left thigh */}
    <line x1="100" y1="96" x2="84" y2="140" stroke={T} strokeWidth="9" strokeLinecap="round"/>
    <J x={84} y={140} r={5}/>
    {/* Left shin */}
    <line x1="84" y1="140" x2="82" y2="178" stroke={T} strokeWidth="7" strokeLinecap="round"/>
    {/* Right thigh */}
    <line x1="100" y1="96" x2="116" y2="140" stroke={T} strokeWidth="9" strokeLinecap="round"/>
    <J x={116} y={140} r={5}/>
    {/* Right shin */}
    <line x1="116" y1="140" x2="118" y2="178" stroke={T} strokeWidth="7" strokeLinecap="round"/>

    {/* Animated: bar + arms */}
    <g className="pv">
      {/* Left upper arm */}
      <line x1="76" y1="52" x2="52" y2="72" stroke={T} strokeWidth="9" strokeLinecap="round"/>
      <J x={52} y={72}/>
      {/* Left forearm */}
      <line x1="52" y1="72" x2="40" y2="96" stroke={color} strokeWidth="7" strokeLinecap="round"/>
      {/* Right upper arm */}
      <line x1="124" y1="52" x2="148" y2="72" stroke={T} strokeWidth="9" strokeLinecap="round"/>
      <J x={148} y={72}/>
      {/* Right forearm */}
      <line x1="148" y1="72" x2="160" y2="96" stroke={color} strokeWidth="7" strokeLinecap="round"/>
      {/* Bar shaft */}
      <rect x="18" y="92" width="164" height="7" rx="3.5" fill={color}/>
      {/* Plates L */}
      <rect x="10" y="80" width="10" height="31" rx="3" fill={color} opacity=".75"/>
      <rect x="23" y="84" width="7"  height="23" rx="2" fill={color} opacity=".5"/>
      {/* Plates R */}
      <rect x="180" y="80" width="10" height="31" rx="3" fill={color} opacity=".75"/>
      <rect x="170" y="84" width="7"  height="23" rx="2" fill={color} opacity=".5"/>
    </g>

    <Lbl text="PRESS MILITAR"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   DOMINADA  —  vista frontal
   Body hangs from bar and pulls upward.
   ══════════════════════════════════════════════════════════════ */
const PullV: React.FC<{color:string}> = ({color}) => (
  <svg viewBox="0 0 200 196" width="100%">
    <style>{`
      @keyframes pullv { 0%,100%{transform:translateY(0)} 50%{transform:translateY(36px)} }
      .pullv { animation: pullv 2.4s cubic-bezier(.37,0,.63,1) infinite; }
    `}</style>

    {/* Bar & brackets */}
    <rect x="16" y="14" width="168" height="10" rx="5" fill={EQ}/>
    <rect x="22" y="6"  width="12"  height="10" rx="3" fill={EQ}/>
    <rect x="166" y="6" width="12"  height="10" rx="3" fill={EQ}/>

    {/* Animated body (starts high, drops to full hang) */}
    <g className="pullv">
      {/* Hands (grip) */}
      <circle cx="64"  cy="24" r="6" fill={color} opacity=".85"/>
      <circle cx="136" cy="24" r="6" fill={color} opacity=".85"/>
      {/* Left arm: upper */}
      <line x1="64"  y1="24" x2="76"  y2="50" stroke={color} strokeWidth="8" strokeLinecap="round"/>
      <J x={76} y={50}/>
      {/* Left arm: lower */}
      <line x1="76"  y1="50" x2="88"  y2="68" stroke={T} strokeWidth="7" strokeLinecap="round"/>
      {/* Right arm: upper */}
      <line x1="136" y1="24" x2="124" y2="50" stroke={color} strokeWidth="8" strokeLinecap="round"/>
      <J x={124} y={50}/>
      {/* Right arm: lower */}
      <line x1="124" y1="50" x2="112" y2="68" stroke={T} strokeWidth="7" strokeLinecap="round"/>
      {/* Head */}
      <circle cx="100" cy="74" r="14" fill={SK} stroke={T} strokeWidth="2"/>
      {/* Torso */}
      <line x1="100" y1="89"  x2="100" y2="140" stroke={T} strokeWidth="10" strokeLinecap="round"/>
      {/* Left leg */}
      <line x1="100" y1="140" x2="88"  y2="168" stroke={T} strokeWidth="8" strokeLinecap="round"/>
      <J x={88} y={168} r={5}/>
      <line x1="88"  y1="168" x2="90"  y2="188" stroke={T} strokeWidth="6" strokeLinecap="round"/>
      {/* Right leg */}
      <line x1="100" y1="140" x2="112" y2="168" stroke={T} strokeWidth="8" strokeLinecap="round"/>
      <J x={112} y={168} r={5}/>
      <line x1="112" y1="168" x2="110" y2="188" stroke={T} strokeWidth="6" strokeLinecap="round"/>
    </g>

    <Lbl text="DOMINADA / PULL-UP"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   REMO  —  vista lateral sentado
   Handle travels toward abdomen.
   ══════════════════════════════════════════════════════════════ */
const PullH: React.FC<{color:string}> = ({color}) => (
  <svg viewBox="0 0 200 196" width="100%">
    <style>{`
      @keyframes pullh {
        0%,100%{transform:translateX(0)}
        50%{transform:translateX(-26px)}
      }
      .pullh { animation: pullh 2.3s cubic-bezier(.37,0,.63,1) infinite; }
    `}</style>

    {/* Seat */}
    <rect x="10" y="108" width="52" height="10" rx="4" fill={EQ}/>
    <rect x="14" y="118" width="10" height="32" rx="3" fill={EQ}/>

    {/* Cable machine */}
    <rect x="170" y="14" width="18" height="100" rx="5" fill={EQ}/>
    <circle cx="179" cy="62" r="9" fill={T} opacity=".4"/>

    {/* Static body */}
    {/* Head */}
    <circle cx="36" cy="54" r="14" fill={SK} stroke={T} strokeWidth="2"/>
    {/* Torso (slight forward lean) */}
    <line x1="36" y1="69" x2="42" y2="108" stroke={T} strokeWidth="10" strokeLinecap="round"/>
    {/* Thighs */}
    <line x1="42" y1="108" x2="80" y2="108" stroke={T} strokeWidth="9"  strokeLinecap="round"/>
    <line x1="42" y1="108" x2="74" y2="108" stroke={T} strokeWidth="9"  strokeLinecap="round"/>
    {/* Shins (vertical down) */}
    <line x1="80" y1="108" x2="78" y2="148" stroke={T} strokeWidth="7" strokeLinecap="round"/>
    <J x={80} y={108} r={5}/>
    <line x1="74" y1="108" x2="72" y2="148" stroke={T} strokeWidth="7" strokeLinecap="round"/>
    {/* Feet */}
    <line x1="72" y1="148" x2="88" y2="148" stroke={T} strokeWidth="6" strokeLinecap="round"/>

    {/* Animated: arms + cable handle */}
    <g className="pullh">
      {/* Cable line */}
      <line x1="78" y1="78" x2="170" y2="62" stroke={color} strokeWidth="2"
        strokeDasharray="5,4" opacity=".7"/>
      {/* Upper arm */}
      <line x1="42" y1="80" x2="90"  y2="80" stroke={T} strokeWidth="8" strokeLinecap="round"/>
      <J x={90} y={80}/>
      {/* Forearm */}
      <line x1="90" y1="80" x2="148" y2="74" stroke={color} strokeWidth="7" strokeLinecap="round"/>
      {/* Handle */}
      <rect x="148" y="68" width="16" height="12" rx="4" fill={color} opacity=".9"/>
    </g>

    <Lbl text="REMO CON CABLE"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   SENTADILLA  —  vista lateral
   Full body descends into squat; bar stays on back.
   ══════════════════════════════════════════════════════════════ */
const Squat: React.FC<{color:string}> = ({color}) => (
  <svg viewBox="0 0 200 196" width="100%">
    <style>{`
      @keyframes sq {
        0%,100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(32px);
        }
      }
      @keyframes sqKnee {
        0%,100% { transform: rotate(0deg); }
        50%      { transform: rotate(28deg); }
      }
      .sq-body  { animation: sq 2.4s cubic-bezier(.37,0,.63,1) infinite; }
      .sq-shin  { animation: sq 2.4s cubic-bezier(.37,0,.63,1) infinite; transform-origin: 84px 138px; }
      .sq-shin2 { animation: sq 2.4s cubic-bezier(.37,0,.63,1) infinite; transform-origin: 116px 138px; }
    `}</style>

    {/* Floor */}
    <rect x="24" y="178" width="152" height="6" rx="3" fill={EQ}/>

    {/* Bar (on back, moves with body) */}
    <g className="sq-body">
      {/* Bar shaft */}
      <rect x="14" y="44" width="172" height="7" rx="3.5" fill={color}/>
      {/* Plates */}
      <rect x="10"  y="33" width="8"  height="29" rx="3" fill={color} opacity=".75"/>
      <rect x="182" y="33" width="8"  height="29" rx="3" fill={color} opacity=".75"/>
      <rect x="21"  y="37" width="6"  height="21" rx="2" fill={color} opacity=".5"/>
      <rect x="173" y="37" width="6"  height="21" rx="2" fill={color} opacity=".5"/>
      {/* Head */}
      <circle cx="100" cy="22" r="13" fill={SK} stroke={T} strokeWidth="2"/>
      {/* Torso */}
      <line x1="100" y1="36"  x2="100" y2="92" stroke={T} strokeWidth="10" strokeLinecap="round"/>
      {/* Arms holding bar */}
      <line x1="100" y1="52" x2="70"  y2="52" stroke={color} strokeWidth="6" strokeLinecap="round"/>
      <line x1="100" y1="52" x2="130" y2="52" stroke={color} strokeWidth="6" strokeLinecap="round"/>
      {/* Hips */}
      <line x1="88"  y1="92" x2="112" y2="92" stroke={T} strokeWidth="6" strokeLinecap="round"/>
      {/* Thighs */}
      <line x1="88"  y1="92" x2="84"  y2="138" stroke={T} strokeWidth="9" strokeLinecap="round"/>
      <line x1="112" y1="92" x2="116" y2="138" stroke={T} strokeWidth="9" strokeLinecap="round"/>
      <J x={84}  y={138} r={5}/>
      <J x={116} y={138} r={5}/>
      {/* Shins */}
      <line x1="84"  y1="138" x2="78"  y2="178" stroke={T} strokeWidth="7" strokeLinecap="round"/>
      <line x1="116" y1="138" x2="122" y2="178" stroke={T} strokeWidth="7" strokeLinecap="round"/>
    </g>

    <Lbl text="SENTADILLA / SQUAT"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   PESO MUERTO  —  vista lateral
   Torso hinges forward; bar lifts from floor to hips.
   ══════════════════════════════════════════════════════════════ */
const Hinge: React.FC<{color:string}> = ({color}) => (
  <svg viewBox="0 0 200 196" width="100%">
    <style>{`
      @keyframes hn {
        0%,100% { transform: rotate(0deg); }
        50%      { transform: rotate(48deg); }
      }
      .hn-torso { animation: hn 2.4s cubic-bezier(.37,0,.63,1) infinite; transform-origin: 108px 106px; }
    `}</style>

    {/* Floor */}
    <rect x="14" y="176" width="172" height="6" rx="3" fill={EQ}/>

    {/* Static legs */}
    <line x1="92"  y1="106" x2="86"  y2="150" stroke={T} strokeWidth="9" strokeLinecap="round"/>
    <J x={86} y={150} r={5}/>
    <line x1="86"  y1="150" x2="84"  y2="176" stroke={T} strokeWidth="7" strokeLinecap="round"/>
    <line x1="116" y1="106" x2="118" y2="150" stroke={T} strokeWidth="9" strokeLinecap="round"/>
    <J x={118} y={150} r={5}/>
    <line x1="118" y1="150" x2="120" y2="176" stroke={T} strokeWidth="7" strokeLinecap="round"/>

    {/* Animated torso + bar */}
    <g className="hn-torso">
      {/* Torso */}
      <line x1="108" y1="106" x2="96" y2="56" stroke={T} strokeWidth="10" strokeLinecap="round"/>
      {/* Head */}
      <circle cx="92" cy="44" r="13" fill={SK} stroke={T} strokeWidth="2"/>
      {/* Left arm */}
      <line x1="104" y1="82" x2="74"  y2="90" stroke={T} strokeWidth="8" strokeLinecap="round"/>
      <J x={74} y={90}/>
      <line x1="74"  y1="90" x2="42"  y2="100" stroke={color} strokeWidth="7" strokeLinecap="round"/>
      {/* Right arm */}
      <line x1="110" y1="82" x2="134" y2="90" stroke={T} strokeWidth="8" strokeLinecap="round"/>
      <J x={134} y={90}/>
      <line x1="134" y1="90" x2="162" y2="100" stroke={color} strokeWidth="7" strokeLinecap="round"/>
      {/* Barbell */}
      <rect x="14"  y="96" width="170" height="7" rx="3.5" fill={color}/>
      <rect x="10"  y="84" width="8"   height="31" rx="3" fill={color} opacity=".75"/>
      <rect x="182" y="84" width="8"   height="31" rx="3" fill={color} opacity=".75"/>
    </g>

    <Lbl text="PESO MUERTO / HINGE"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   CURL DE BÍCEPS  —  vista lateral
   Forearm rotates upward around elbow joint.
   ══════════════════════════════════════════════════════════════ */
const Curl: React.FC<{color:string}> = ({color}) => (
  <svg viewBox="0 0 200 196" width="100%">
    <style>{`
      @keyframes cu {
        0%,100% { transform: rotate(0deg); }
        50%      { transform: rotate(-112deg); }
      }
      .cu-fore { animation: cu 2.2s cubic-bezier(.37,0,.63,1) infinite; transform-origin: 118px 90px; }
    `}</style>

    {/* Floor */}
    <rect x="40" y="178" width="120" height="6" rx="3" fill={EQ}/>

    {/* Body */}
    <circle cx="100" cy="24" r="14" fill={SK} stroke={T} strokeWidth="2"/>
    <line x1="100" y1="39"  x2="100" y2="98" stroke={T} strokeWidth="10" strokeLinecap="round"/>
    {/* Legs */}
    <line x1="100" y1="98"  x2="86"  y2="142" stroke={T} strokeWidth="9" strokeLinecap="round"/>
    <J x={86} y={142} r={5}/>
    <line x1="86"  y1="142" x2="84"  y2="178" stroke={T} strokeWidth="7" strokeLinecap="round"/>
    <line x1="100" y1="98"  x2="114" y2="142" stroke={T} strokeWidth="9" strokeLinecap="round"/>
    <J x={114} y={142} r={5}/>
    <line x1="114" y1="142" x2="116" y2="178" stroke={T} strokeWidth="7" strokeLinecap="round"/>

    {/* Static (resting) arm */}
    <line x1="82"  y1="58" x2="72"  y2="90" stroke={T} strokeWidth="8" strokeLinecap="round"/>
    <J x={72} y={90}/>
    <line x1="72"  y1="90" x2="68"  y2="136" stroke={T} strokeWidth="7" strokeLinecap="round"/>
    <ellipse cx="68" cy="144" rx="9" ry="6" fill={T} opacity=".35" transform="rotate(-10 68 144)"/>

    {/* Active (curl) upper arm */}
    <line x1="118" y1="58" x2="118" y2="90" stroke={T} strokeWidth="8" strokeLinecap="round"/>
    <J x={118} y={90}/>
    {/* Animated forearm */}
    <g className="cu-fore">
      <line x1="118" y1="90" x2="118" y2="138" stroke={color} strokeWidth="8" strokeLinecap="round"/>
      {/* Dumbbell */}
      <rect x="108" y="138" width="20" height="8" rx="4" fill={color}/>
      <rect x="104" y="134" width="8"  height="16" rx="3" fill={color} opacity=".7"/>
      <rect x="128" y="134" width="8"  height="16" rx="3" fill={color} opacity=".7"/>
    </g>

    <Lbl text="CURL DE BÍCEPS"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   EXTENSIÓN DE TRÍCEPS  —  vista lateral
   Forearm extends downward (pushdown) or overhead.
   ══════════════════════════════════════════════════════════════ */
const Extension: React.FC<{color:string}> = ({color}) => (
  <svg viewBox="0 0 200 196" width="100%">
    <style>{`
      @keyframes ex {
        0%,100% { transform: rotate(-85deg); }
        50%      { transform: rotate(0deg); }
      }
      .ex-fore { animation: ex 2.2s cubic-bezier(.37,0,.63,1) infinite; transform-origin: 118px 72px; }
    `}</style>

    {/* Cable machine */}
    <rect x="166" y="10" width="18" height="120" rx="5" fill={EQ}/>
    <circle cx="175" cy="38" r="8" fill={T} opacity=".35"/>
    {/* Cable to hand */}
    <line x1="175" y1="46" x2="148" y2="72" stroke={color} strokeWidth="2" strokeDasharray="4,4" opacity=".6"/>

    {/* Floor */}
    <rect x="30" y="178" width="140" height="6" rx="3" fill={EQ}/>

    {/* Body */}
    <circle cx="100" cy="24" r="14" fill={SK} stroke={T} strokeWidth="2"/>
    <line x1="100" y1="39"  x2="100" y2="98" stroke={T} strokeWidth="10" strokeLinecap="round"/>
    <line x1="100" y1="98"  x2="86"  y2="142" stroke={T} strokeWidth="9" strokeLinecap="round"/>
    <J x={86} y={142} r={5}/>
    <line x1="86"  y1="142" x2="84"  y2="178" stroke={T} strokeWidth="7" strokeLinecap="round"/>
    <line x1="100" y1="98"  x2="114" y2="142" stroke={T} strokeWidth="9" strokeLinecap="round"/>
    <J x={114} y={142} r={5}/>
    <line x1="114" y1="142" x2="116" y2="178" stroke={T} strokeWidth="7" strokeLinecap="round"/>

    {/* Active arm: upper arm pinned to side */}
    <line x1="118" y1="52" x2="118" y2="72" stroke={T} strokeWidth="8" strokeLinecap="round"/>
    <J x={118} y={72}/>
    {/* Animated forearm */}
    <g className="ex-fore">
      <line x1="118" y1="72" x2="118" y2="130" stroke={color} strokeWidth="8" strokeLinecap="round"/>
      {/* Handle / rope */}
      <rect x="108" y="128" width="20" height="8" rx="4" fill={color}/>
    </g>

    {/* Static other arm */}
    <line x1="82"  y1="58" x2="80"  y2="78" stroke={T} strokeWidth="8" strokeLinecap="round"/>
    <J x={80} y={78}/>
    <line x1="80"  y1="78" x2="76"  y2="114" stroke={T} strokeWidth="7" strokeLinecap="round"/>

    <Lbl text="EXTENSIÓN DE TRÍCEPS"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   ELEVACIÓN LATERAL  —  vista frontal
   Both arms raise from sides to shoulder height.
   ══════════════════════════════════════════════════════════════ */
const Raise: React.FC<{color:string}> = ({color}) => (
  <svg viewBox="0 0 200 196" width="100%">
    <style>{`
      @keyframes ra {
        0%,100% { transform: rotate(0deg); }
        50%      { transform: rotate(-68deg); }
      }
      @keyframes raR {
        0%,100% { transform: rotate(0deg); }
        50%      { transform: rotate(68deg); }
      }
      .ra-L { animation: ra  2.2s cubic-bezier(.37,0,.63,1) infinite; transform-origin: 76px 58px; }
      .ra-R { animation: raR 2.2s cubic-bezier(.37,0,.63,1) infinite; transform-origin: 124px 58px; }
    `}</style>

    {/* Floor */}
    <rect x="30" y="178" width="140" height="6" rx="3" fill={EQ}/>

    {/* Body */}
    <circle cx="100" cy="22" r="14" fill={SK} stroke={T} strokeWidth="2"/>
    <line x1="100" y1="37"  x2="100" y2="96" stroke={T} strokeWidth="10" strokeLinecap="round"/>
    <line x1="100" y1="96"  x2="84"  y2="140" stroke={T} strokeWidth="9" strokeLinecap="round"/>
    <J x={84} y={140} r={5}/>
    <line x1="84"  y1="140" x2="82"  y2="178" stroke={T} strokeWidth="7" strokeLinecap="round"/>
    <line x1="100" y1="96"  x2="116" y2="140" stroke={T} strokeWidth="9" strokeLinecap="round"/>
    <J x={116} y={140} r={5}/>
    <line x1="116" y1="140" x2="118" y2="178" stroke={T} strokeWidth="7" strokeLinecap="round"/>

    {/* Left arm (animated) */}
    <g className="ra-L">
      <line x1="76" y1="58" x2="44" y2="90" stroke={color} strokeWidth="8" strokeLinecap="round"/>
      <J x={44} y={90}/>
      <line x1="44" y1="90" x2="36" y2="118" stroke={color} strokeWidth="7" strokeLinecap="round"/>
      {/* Dumbbell */}
      <ellipse cx="32" cy="122" rx="5" ry="10" fill={color} opacity=".8" transform="rotate(-20 32 122)"/>
    </g>

    {/* Right arm (animated) */}
    <g className="ra-R">
      <line x1="124" y1="58" x2="156" y2="90" stroke={color} strokeWidth="8" strokeLinecap="round"/>
      <J x={156} y={90}/>
      <line x1="156" y1="90" x2="164" y2="118" stroke={color} strokeWidth="7" strokeLinecap="round"/>
      {/* Dumbbell */}
      <ellipse cx="168" cy="122" rx="5" ry="10" fill={color} opacity=".8" transform="rotate(20 168 122)"/>
    </g>

    <Lbl text="ELEVACIÓN LATERAL"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   HIP THRUST  —  vista lateral
   Hips drive upward from floor level.
   ══════════════════════════════════════════════════════════════ */
const HipThrust: React.FC<{color:string}> = ({color}) => (
  <svg viewBox="0 0 200 196" width="100%">
    <style>{`
      @keyframes ht {
        0%,100% { transform: translateY(0) rotate(0deg); }
        50%      { transform: translateY(-28px) rotate(-10deg); }
      }
      .ht-body { animation: ht 2.2s cubic-bezier(.37,0,.63,1) infinite; transform-origin: 94px 114px; }
    `}</style>

    {/* Floor */}
    <rect x="10" y="174" width="180" height="6" rx="3" fill={EQ}/>
    {/* Bench */}
    <rect x="10" y="96" width="58" height="14" rx="5" fill={EQ}/>
    <rect x="14" y="110" width="12" height="22" rx="3" fill={EQ}/>

    {/* Animated hip/torso group */}
    <g className="ht-body">
      {/* Upper back on bench */}
      <rect x="18" y="80" width="46" height="18" rx="6" fill={SK} stroke={T} strokeWidth="2"/>
      {/* Head */}
      <circle cx="24" cy="68" r="13" fill={SK} stroke={T} strokeWidth="2"/>
      {/* Glutes / hips */}
      <ellipse cx="94" cy="108" rx="22" ry="16" fill={color} opacity=".8"/>
      {/* Barbell over hips */}
      <rect x="52" y="96" width="110" height="7" rx="3.5" fill={color} opacity=".7"/>
      <rect x="48"  y="88" width="8"  height="23" rx="3" fill={color} opacity=".6"/>
      <rect x="162" y="88" width="8"  height="23" rx="3" fill={color} opacity=".6"/>
      {/* Thighs */}
      <line x1="78"  y1="116" x2="74"  y2="162" stroke={T} strokeWidth="9" strokeLinecap="round"/>
      <J x={74} y={162} r={5}/>
      <line x1="74"  y1="162" x2="66"  y2="174" stroke={T} strokeWidth="7" strokeLinecap="round"/>
      <line x1="112" y1="116" x2="120" y2="162" stroke={T} strokeWidth="9" strokeLinecap="round"/>
      <J x={120} y={162} r={5}/>
      <line x1="120" y1="162" x2="130" y2="174" stroke={T} strokeWidth="7" strokeLinecap="round"/>
    </g>

    <Lbl text="HIP THRUST / GLÚTEO"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   PLANCHA  —  vista lateral, isométrico con pulso de core
   ══════════════════════════════════════════════════════════════ */
const Plank: React.FC<{color:string}> = ({color}) => (
  <svg viewBox="0 0 200 196" width="100%">
    <style>{`
      @keyframes pk { 0%,100%{opacity:.9; transform:scaleY(1)} 50%{opacity:.4; transform:scaleY(.8)} }
      @keyframes pkGlow { 0%,100%{filter:drop-shadow(0 0 0px transparent)} 50%{filter:drop-shadow(0 0 6px ${color})} }
      .pk-core { animation: pk 1.8s ease-in-out infinite; transform-origin: 110px 104px; }
      .pk-body { animation: pkGlow 1.8s ease-in-out infinite; }
    `}</style>

    {/* Floor */}
    <rect x="10" y="150" width="180" height="6" rx="3" fill={EQ}/>

    <g className="pk-body">
      {/* Head */}
      <circle cx="168" cy="76" r="14" fill={SK} stroke={T} strokeWidth="2"/>
      {/* Torso */}
      <rect x="52" y="98" width="116" height="14" rx="6" fill={SK} stroke={T} strokeWidth="2"/>
      {/* Core highlight */}
      <rect x="80" y="99" width="62" height="12" rx="5" fill={color} className="pk-core"/>
      {/* Neck */}
      <line x1="168" y1="90" x2="165" y2="100" stroke={T} strokeWidth="4" strokeLinecap="round"/>
      {/* Forearms (elbows on ground) */}
      <line x1="70"  y1="108" x2="52"  y2="150" stroke={T} strokeWidth="8" strokeLinecap="round"/>
      <J x={52} y={150} r={5}/>
      <line x1="58"  y1="108" x2="42"  y2="150" stroke={T} strokeWidth="7" strokeLinecap="round"/>
      {/* Rear leg */}
      <line x1="52"  y1="108" x2="30"  y2="150" stroke={T} strokeWidth="8" strokeLinecap="round"/>
      {/* Front leg */}
      <line x1="64"  y1="108" x2="44"  y2="150" stroke={T} strokeWidth="8" strokeLinecap="round"/>
    </g>

    <Lbl text="PLANCHA / ISOMÉTRICO"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   CARDIO  —  figura corriendo, vista lateral
   Alternating arms and legs with stride motion.
   ══════════════════════════════════════════════════════════════ */
const Cardio: React.FC<{color:string}> = ({color}) => (
  <svg viewBox="0 0 200 196" width="100%">
    <style>{`
      @keyframes legFwd  { 0%,100%{transform:rotate(-28deg)} 50%{transform:rotate(38deg)} }
      @keyframes legBck  { 0%,100%{transform:rotate(32deg)}  50%{transform:rotate(-34deg)} }
      @keyframes armFwd  { 0%,100%{transform:rotate(36deg)}  50%{transform:rotate(-30deg)} }
      @keyframes armBck  { 0%,100%{transform:rotate(-30deg)} 50%{transform:rotate(36deg)} }
      @keyframes torsoB  { 0%,100%{transform:rotate(-4deg)}  50%{transform:rotate(4deg)} }
      @keyframes shinF   { 0%,100%{transform:rotate(0deg)}   50%{transform:rotate(-40deg)} }
      @keyframes shinB   { 0%,100%{transform:rotate(0deg)}   50%{transform:rotate(-55deg)} }
      .leg-fwd  { animation: legFwd .65s ease-in-out infinite; transform-origin: 100px 96px; }
      .leg-bck  { animation: legBck .65s ease-in-out infinite; transform-origin: 100px 96px; }
      .arm-fwd  { animation: armFwd .65s ease-in-out infinite; transform-origin: 100px 56px; }
      .arm-bck  { animation: armBck .65s ease-in-out infinite; transform-origin: 100px 56px; }
      .torso-b  { animation: torsoB .65s ease-in-out infinite; transform-origin: 100px 76px; }
      .shin-f   { animation: shinF  .65s ease-in-out infinite; transform-origin: 108px 138px; }
      .shin-b   { animation: shinB  .65s ease-in-out infinite; transform-origin: 92px 138px; }
    `}</style>

    {/* Ground with motion lines */}
    <rect x="10" y="172" width="180" height="5" rx="2" fill={EQ}/>
    <line x1="20" y1="165" x2="50" y2="165" stroke={EQ} strokeWidth="2" strokeLinecap="round" opacity=".5"/>
    <line x1="10" y1="161" x2="34" y2="161" stroke={EQ} strokeWidth="2" strokeLinecap="round" opacity=".3"/>

    {/* Head */}
    <circle cx="100" cy="24" r="14" fill={SK} stroke={T} strokeWidth="2"/>

    {/* Torso (slight bob) */}
    <g className="torso-b">
      <line x1="100" y1="39" x2="100" y2="96" stroke={T} strokeWidth="9" strokeLinecap="round"/>
    </g>

    {/* Front arm */}
    <g className="arm-fwd">
      <line x1="100" y1="56" x2="80"  y2="84" stroke={color} strokeWidth="7" strokeLinecap="round"/>
      <J x={80} y={84}/>
      <line x1="80"  y1="84" x2="68"  y2="64" stroke={color} strokeWidth="6" strokeLinecap="round"/>
    </g>

    {/* Back arm */}
    <g className="arm-bck">
      <line x1="100" y1="56" x2="122" y2="82" stroke={T} strokeWidth="7" strokeLinecap="round"/>
      <J x={122} y={82}/>
      <line x1="122" y1="82" x2="138" y2="64" stroke={T} strokeWidth="6" strokeLinecap="round"/>
    </g>

    {/* Front leg (thigh) */}
    <g className="leg-fwd">
      <line x1="100" y1="96" x2="108" y2="138" stroke={color} strokeWidth="9" strokeLinecap="round"/>
      <J x={108} y={138} r={5}/>
      {/* Front shin */}
      <g className="shin-f">
        <line x1="108" y1="138" x2="112" y2="172" stroke={color} strokeWidth="7" strokeLinecap="round"/>
      </g>
    </g>

    {/* Back leg (thigh) */}
    <g className="leg-bck">
      <line x1="100" y1="96" x2="92"  y2="138" stroke={T} strokeWidth="9" strokeLinecap="round"/>
      <J x={92} y={138} r={5}/>
      {/* Back shin */}
      <g className="shin-b">
        <line x1="92"  y1="138" x2="88"  y2="172" stroke={T} strokeWidth="7" strokeLinecap="round"/>
      </g>
    </g>

    <Lbl text="EJERCICIO CARDIOVASCULAR"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   Exported component
   ══════════════════════════════════════════════════════════════ */
export const ExerciseAnimation: React.FC<Props> = ({ type, color }) => {
  const map: Record<MovementType, React.ReactElement> = {
    push_h:     <PushH    color={color}/>,
    push_v:     <PushV    color={color}/>,
    pull_v:     <PullV    color={color}/>,
    pull_h:     <PullH    color={color}/>,
    squat:      <Squat    color={color}/>,
    hinge:      <Hinge    color={color}/>,
    curl:       <Curl     color={color}/>,
    extension:  <Extension color={color}/>,
    raise:      <Raise    color={color}/>,
    hip_thrust: <HipThrust color={color}/>,
    plank:      <Plank    color={color}/>,
    cardio:     <Cardio   color={color}/>,
  };
  return (
    <div style={{ padding: '8px 16px', width: '100%', maxWidth: 320, margin: '0 auto' }}>
      {map[type]}
    </div>
  );
};
