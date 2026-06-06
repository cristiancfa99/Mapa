import type {
  User, Workout, Routine, PersonalRecord,
  BodyWeight, WeeklyVolume, AIInsight, CommunityPost, NutritionDay,
} from '../types';
import { exercises } from './exercises';

const ex = (id: string) => exercises.find(e => e.id === id)!;

export const mockUser: User = {
  id: 'user-1',
  name: 'Alex García',
  email: 'alex@fittrack.app',
  age: 27,
  gender: 'male',
  weight: 80,
  height: 178,
  experienceLevel: 'intermediate',
  goal: 'muscle_gain',
  joinDate: '2024-01-15',
  isPremium: false,
  level: 12,
  xp: 2400,
  xpNextLevel: 3000,
  stats: {
    totalWorkouts: 87,
    totalVolume: 124_500,
    totalDuration: 4_350,
    streak: 4,
    longestStreak: 21,
    thisWeekWorkouts: 3,
    thisWeekVolume: 4_200,
  },
  badges: [
    { id: 'b1', name: 'Primer Entrenamiento', description: 'Completaste tu primer entrenamiento', icon: '🎯', earnedAt: '2024-01-15', locked: false, category: 'milestone' },
    { id: 'b2', name: 'Semana Constante',    description: '7 días seguidos entrenando',         icon: '🔥', earnedAt: '2024-02-01', locked: false, category: 'streak' },
    { id: 'b3', name: '10 Entrenamientos',   description: 'Completaste 10 entrenamientos',       icon: '💪', earnedAt: '2024-02-20', locked: false, category: 'milestone' },
    { id: 'b4', name: 'PR Beast',            description: 'Batiste 5 récords personales',        icon: '🏆', earnedAt: '2024-03-10', locked: false, category: 'strength' },
    { id: 'b5', name: '50 Entrenamientos',   description: 'Completaste 50 entrenamientos',       icon: '⭐', earnedAt: '2024-05-15', locked: false, category: 'milestone' },
    { id: 'b6', name: 'Madrugador',          description: '10 entrenamientos antes de las 7 AM', icon: '🌅', locked: true, category: 'consistency' },
    { id: 'b7', name: '100 Entrenamientos',  description: 'Completaste 100 entrenamientos',      icon: '💯', locked: true, category: 'milestone' },
    { id: 'b8', name: '1 Año de Constancia', description: 'Un año entrenando con FitTrack',      icon: '🎖️', locked: true, category: 'streak' },
  ],
};

export const mockRoutines: Routine[] = [
  {
    id: 'r1', name: 'Push Day A', description: 'Pecho, hombros y tríceps',
    category: 'push_pull_legs', difficulty: 'intermediate',
    estimatedDuration: 65, color: '#EF4444',
    createdAt: '2024-02-01', updatedAt: '2024-05-10',
    exercises: [
      { id: 're1', exerciseId: 'bench-press',     exercise: ex('bench-press'),     sets: 4, repsMin: 6, repsMax: 8,  restTime: 180 },
      { id: 're2', exerciseId: 'incline-bench',   exercise: ex('incline-bench'),   sets: 3, repsMin: 8, repsMax: 12, restTime: 120 },
      { id: 're3', exerciseId: 'overhead-press',  exercise: ex('overhead-press'),  sets: 3, repsMin: 8, repsMax: 10, restTime: 120 },
      { id: 're4', exerciseId: 'lateral-raise',   exercise: ex('lateral-raise'),   sets: 4, repsMin: 12, repsMax: 15, restTime: 60 },
      { id: 're5', exerciseId: 'tricep-pushdown', exercise: ex('tricep-pushdown'), sets: 3, repsMin: 10, repsMax: 12, restTime: 90 },
    ],
  },
  {
    id: 'r2', name: 'Pull Day A', description: 'Espalda y bíceps',
    category: 'push_pull_legs', difficulty: 'intermediate',
    estimatedDuration: 70, color: '#3B82F6',
    createdAt: '2024-02-01', updatedAt: '2024-05-10',
    exercises: [
      { id: 're6', exerciseId: 'pull-up',          exercise: ex('pull-up'),          sets: 4, repsMin: 6,  repsMax: 10, restTime: 180 },
      { id: 're7', exerciseId: 'bent-over-row',    exercise: ex('bent-over-row'),    sets: 4, repsMin: 6,  repsMax: 8,  restTime: 180 },
      { id: 're8', exerciseId: 'seated-cable-row', exercise: ex('seated-cable-row'), sets: 3, repsMin: 10, repsMax: 12, restTime: 90 },
      { id: 're9', exerciseId: 'face-pull',        exercise: ex('face-pull'),        sets: 3, repsMin: 15, repsMax: 20, restTime: 60 },
      { id: 're10', exerciseId: 'barbell-curl',    exercise: ex('barbell-curl'),     sets: 3, repsMin: 8,  repsMax: 12, restTime: 90 },
    ],
  },
  {
    id: 'r3', name: 'Leg Day A', description: 'Cuádriceps, isquios y glúteos',
    category: 'push_pull_legs', difficulty: 'intermediate',
    estimatedDuration: 75, color: '#10B981',
    createdAt: '2024-02-01', updatedAt: '2024-05-10',
    exercises: [
      { id: 're11', exerciseId: 'back-squat',           exercise: ex('back-squat'),           sets: 4, repsMin: 5, repsMax: 8, restTime: 210 },
      { id: 're12', exerciseId: 'romanian-deadlift',    exercise: ex('romanian-deadlift'),    sets: 3, repsMin: 8, repsMax: 10, restTime: 150 },
      { id: 're13', exerciseId: 'leg-press',            exercise: ex('leg-press'),            sets: 3, repsMin: 10, repsMax: 15, restTime: 120 },
      { id: 're14', exerciseId: 'leg-curl',             exercise: ex('leg-curl'),             sets: 3, repsMin: 12, repsMax: 15, restTime: 90 },
      { id: 're15', exerciseId: 'bulgarian-split-squat',exercise: ex('bulgarian-split-squat'),sets: 3, repsMin: 8,  repsMax: 12, restTime: 120 },
    ],
  },
];

const makeSet = (weight: number, reps: number, completed = true) => ({
  id: `s-${Math.random().toString(36).slice(2)}`,
  weight, reps, completed, rpe: Math.floor(Math.random() * 3) + 7,
});

export const mockWorkouts: Workout[] = [
  {
    id: 'w1', name: 'Push Day A', date: '2024-06-03', duration: 68, routineId: 'r1',
    notes: 'Gran sesión, batí PR en press de banca.',
    volume: 8_240, totalSets: 19, totalReps: 156,
    exercises: [
      {
        id: 'we1', exerciseId: 'bench-press', exercise: ex('bench-press'), restTime: 180,
        sets: [makeSet(100,6), makeSet(100,6), makeSet(97.5,7), makeSet(97.5,8)],
      },
      {
        id: 'we2', exerciseId: 'incline-bench', exercise: ex('incline-bench'), restTime: 120,
        sets: [makeSet(75,8), makeSet(75,9), makeSet(72.5,10)],
      },
      {
        id: 'we3', exerciseId: 'overhead-press', exercise: ex('overhead-press'), restTime: 120,
        sets: [makeSet(65,8), makeSet(62.5,9), makeSet(62.5,10)],
      },
    ],
  },
  {
    id: 'w2', name: 'Pull Day A', date: '2024-06-01', duration: 72, routineId: 'r2',
    volume: 6_180, totalSets: 17, totalReps: 148,
    exercises: [
      {
        id: 'we4', exerciseId: 'pull-up', exercise: ex('pull-up'), restTime: 180,
        sets: [makeSet(20,8), makeSet(20,7), makeSet(17.5,8), makeSet(15,9)],
      },
      {
        id: 'we5', exerciseId: 'bent-over-row', exercise: ex('bent-over-row'), restTime: 180,
        sets: [makeSet(90,6), makeSet(90,6), makeSet(87.5,7), makeSet(85,8)],
      },
    ],
  },
  {
    id: 'w3', name: 'Leg Day A', date: '2024-05-29', duration: 78, routineId: 'r3',
    volume: 14_600, totalSets: 18, totalReps: 130,
    exercises: [
      {
        id: 'we6', exerciseId: 'back-squat', exercise: ex('back-squat'), restTime: 210,
        sets: [makeSet(120,5), makeSet(120,5), makeSet(115,6), makeSet(112.5,8)],
      },
      {
        id: 'we7', exerciseId: 'romanian-deadlift', exercise: ex('romanian-deadlift'), restTime: 150,
        sets: [makeSet(100,8), makeSet(100,9), makeSet(97.5,10)],
      },
    ],
  },
  {
    id: 'w4', name: 'Push Day A', date: '2024-05-27', duration: 65, routineId: 'r1',
    volume: 7_900, totalSets: 18, totalReps: 150,
    exercises: [],
  },
  {
    id: 'w5', name: 'Pull Day A', date: '2024-05-25', duration: 70, routineId: 'r2',
    volume: 6_000, totalSets: 17, totalReps: 142,
    exercises: [],
  },
];

export const mockPRs: PersonalRecord[] = [
  { exerciseId: 'bench-press',     exerciseName: 'Press de Banca',     weight: 100, reps: 6, date: '2024-06-03', oneRepMax: 117 },
  { exerciseId: 'back-squat',      exerciseName: 'Sentadilla',         weight: 120, reps: 5, date: '2024-05-29', oneRepMax: 135 },
  { exerciseId: 'deadlift',        exerciseName: 'Peso Muerto',        weight: 150, reps: 5, date: '2024-05-15', oneRepMax: 169 },
  { exerciseId: 'overhead-press',  exerciseName: 'Press Militar',      weight: 65,  reps: 8, date: '2024-06-03', oneRepMax: 82  },
  { exerciseId: 'bent-over-row',   exerciseName: 'Remo con Barra',     weight: 90,  reps: 6, date: '2024-06-01', oneRepMax: 106 },
];

export const mockBodyWeight: BodyWeight[] = [
  { date: '2024-05-01', weight: 81.5 },
  { date: '2024-05-05', weight: 81.2 },
  { date: '2024-05-10', weight: 80.8 },
  { date: '2024-05-15', weight: 80.5 },
  { date: '2024-05-20', weight: 80.3 },
  { date: '2024-05-25', weight: 80.1 },
  { date: '2024-06-01', weight: 80.0 },
  { date: '2024-06-05', weight: 79.8 },
];

export const mockWeeklyVolume: WeeklyVolume[] = [
  { week: '22 Abr', volume: 18_200, workouts: 4 },
  { week: '29 Abr', volume: 20_400, workouts: 4 },
  { week: '06 May', volume: 19_800, workouts: 3 },
  { week: '13 May', volume: 22_100, workouts: 5 },
  { week: '20 May', volume: 21_500, workouts: 4 },
  { week: '27 May', volume: 24_300, workouts: 5 },
  { week: '03 Jun', volume: 14_420, workouts: 3 },
];

export const mockBenchProgress = [
  { date: '01 Abr', weight: 90 },
  { date: '15 Abr', weight: 92.5 },
  { date: '01 May', weight: 95 },
  { date: '15 May', weight: 97.5 },
  { date: '01 Jun', weight: 97.5 },
  { date: '03 Jun', weight: 100 },
];

export const mockAIInsights: AIInsight[] = [
  {
    id: 'ai1', type: 'progress',
    title: 'Progreso Excelente en Press de Banca',
    message: 'Has progresado un 11% en press de banca en las últimas 6 semanas (90 → 100 kg). Mantén la progresión y aumenta 2.5 kg cuando puedas completar todas las series.',
    exerciseId: 'bench-press', createdAt: '2024-06-04',
    icon: '📈',
  },
  {
    id: 'ai2', type: 'recommendation',
    title: 'Añade Más Trabajo de Femoral',
    message: 'Tu volumen de cuádriceps es 3× mayor que el de isquiotibiales. Añade 2 series de curl femoral o peso muerto rumano para equilibrar el desarrollo y prevenir lesiones.',
    createdAt: '2024-06-03', icon: '💡',
  },
  {
    id: 'ai3', type: 'achievement',
    title: '¡100 Series Esta Semana!',
    message: 'Completaste 100 series de entrenamiento esta semana. Estás en el top 5% de usuarios en términos de volumen semanal.',
    createdAt: '2024-06-02', icon: '🏆',
  },
];

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: 'cp1', userId: 'u2', userName: 'María López', userLevel: 18,
    content: '¡Nuevo PR en sentadilla! 140 kg × 3 después de 4 meses de trabajo. El programa de fuerza está dando resultados 💪',
    type: 'pr', pr: { exerciseId: 'back-squat', exerciseName: 'Sentadilla', weight: 140, reps: 3, date: '2024-06-05', oneRepMax: 153 },
    likes: 47, comments: 12, createdAt: '2024-06-05T10:30:00Z', liked: true,
  },
  {
    id: 'cp2', userId: 'u3', userName: 'Carlos Ruiz', userLevel: 9,
    content: 'Semana de descanso activo completada. Vuelta con todo el lunes 🔥',
    type: 'milestone',
    likes: 23, comments: 5, createdAt: '2024-06-04T18:15:00Z', liked: false,
  },
  {
    id: 'cp3', userId: 'u4', userName: 'Sofia Martín', userLevel: 25,
    content: 'Entrenamiento de espalda completado. 5 ejercicios, 24 series, 1h10min. El jalón al pecho y el remo con mancuerna son mis favoritos 🎯',
    type: 'workout',
    workout: { name: 'Pull Day', duration: 70, volume: 8_400, totalSets: 24 },
    likes: 31, comments: 8, createdAt: '2024-06-04T09:45:00Z', liked: false,
  },
  {
    id: 'cp4', userId: 'u5', userName: 'Diego Pérez', userLevel: 14,
    content: '¡100 entrenamientos completados en FitTrack! 🎉 Cuando empecé no podía hacer ni 5 dominadas y ahora hago series de 10 con lastre.',
    type: 'milestone',
    likes: 89, comments: 24, createdAt: '2024-06-03T20:00:00Z', liked: true,
  },
];

export const mockNutrition: NutritionDay = {
  date: '2024-06-05',
  goals: { calories: 2800, protein: 160, carbs: 320, fat: 90 },
  totals: { calories: 2340, protein: 148, carbs: 272, fat: 76 },
  meals: [
    {
      id: 'm1', type: 'breakfast', name: 'Desayuno', time: '07:30',
      foods: [
        { id: 'f1', name: 'Avena con leche', calories: 350, protein: 14, carbs: 58, fat: 8, serving: 100 },
        { id: 'f2', name: 'Plátano',         calories: 89,  protein: 1,  carbs: 23, fat: 0, serving: 100 },
        { id: 'f3', name: 'Claras de huevo', calories: 52,  protein: 11, carbs: 1,  fat: 0, serving: 100 },
      ],
    },
    {
      id: 'm2', type: 'lunch', name: 'Almuerzo', time: '13:00',
      foods: [
        { id: 'f4', name: 'Pechuga de pollo', calories: 165, protein: 31, carbs: 0, fat: 4, serving: 150 },
        { id: 'f5', name: 'Arroz integral',   calories: 216, protein: 5,  carbs: 45, fat: 2, serving: 100 },
        { id: 'f6', name: 'Brócoli',          calories: 55,  protein: 4,  carbs: 11, fat: 1, serving: 150 },
      ],
    },
    {
      id: 'm3', type: 'snack', name: 'Pre-entreno', time: '17:00',
      foods: [
        { id: 'f7', name: 'Batido de proteínas', calories: 130, protein: 25, carbs: 5, fat: 3, serving: 35 },
        { id: 'f8', name: 'Plátano',             calories: 89,  protein: 1,  carbs: 23, fat: 0, serving: 100 },
      ],
    },
    {
      id: 'm4', type: 'dinner', name: 'Cena', time: '20:30',
      foods: [
        { id: 'f9',  name: 'Salmón',        calories: 208, protein: 29, carbs: 0,  fat: 10, serving: 150 },
        { id: 'f10', name: 'Patata asada',  calories: 130, protein: 3,  carbs: 30, fat: 0,  serving: 150 },
        { id: 'f11', name: 'Ensalada mixta',calories: 25,  protein: 2,  carbs: 5,  fat: 0,  serving: 100 },
      ],
    },
  ],
};

export const mockLeaderboard = [
  { rank: 1, name: 'Sofia Martín',  level: 25, weeklyVolume: 38_200, avatar: 'SM' },
  { rank: 2, name: 'Roberto Kim',   level: 22, weeklyVolume: 34_800, avatar: 'RK' },
  { rank: 3, name: 'María López',   level: 18, weeklyVolume: 31_400, avatar: 'ML' },
  { rank: 4, name: 'Alex García',   level: 12, weeklyVolume: 28_900, avatar: 'AG' },
  { rank: 5, name: 'Diego Pérez',   level: 14, weeklyVolume: 27_300, avatar: 'DP' },
  { rank: 6, name: 'Laura Sánchez', level: 11, weeklyVolume: 24_100, avatar: 'LS' },
  { rank: 7, name: 'Carlos Ruiz',   level: 9,  weeklyVolume: 21_800, avatar: 'CR' },
  { rank: 8, name: 'Ana Torres',    level: 8,  weeklyVolume: 19_500, avatar: 'AT' },
];

export const formatVolume = (v: number): string =>
  v >= 1000 ? `${(v / 1000).toFixed(1)}k kg` : `${v} kg`;

export const formatDuration = (min: number): string => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export const getGoalLabel = (goal: string): string => ({
  muscle_gain: 'Ganar Músculo',
  fat_loss: 'Perder Grasa',
  recomposition: 'Recomposición',
  strength: 'Fuerza Máxima',
  endurance: 'Resistencia',
  general_fitness: 'Forma Física General',
}[goal] ?? goal);
