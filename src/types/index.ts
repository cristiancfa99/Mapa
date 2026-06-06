export type MuscleGroup =
  | 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps'
  | 'legs' | 'glutes' | 'core' | 'cardio' | 'full_body';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type Equipment =
  | 'barbell' | 'dumbbell' | 'cable' | 'machine'
  | 'bodyweight' | 'kettlebell' | 'bands' | 'other';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment;
  difficulty: Difficulty;
  description: string;
  instructions: string[];
  tips: string[];
  commonMistakes: string[];
}

export interface WorkoutSet {
  id: string;
  reps?: number;
  weight?: number;
  duration?: number;
  rpe?: number;
  completed: boolean;
  notes?: string;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  sets: WorkoutSet[];
  notes?: string;
  restTime: number;
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  duration: number;
  exercises: WorkoutExercise[];
  notes?: string;
  volume: number;
  totalSets: number;
  totalReps: number;
  routineId?: string;
}

export interface RoutineExercise {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  sets: number;
  repsMin: number;
  repsMax: number;
  restTime: number;
  notes?: string;
}

export type RoutineCategory =
  | 'push_pull_legs' | 'upper_lower' | 'full_body' | 'custom';

export interface Routine {
  id: string;
  name: string;
  description?: string;
  exercises: RoutineExercise[];
  category: RoutineCategory;
  difficulty: Difficulty;
  estimatedDuration: number;
  createdAt: string;
  updatedAt: string;
  isPublic?: boolean;
  color?: string;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
  oneRepMax: number;
}

export type Goal =
  | 'muscle_gain' | 'fat_loss' | 'recomposition'
  | 'strength' | 'endurance' | 'general_fitness';

export interface UserStats {
  totalWorkouts: number;
  totalVolume: number;
  totalDuration: number;
  streak: number;
  longestStreak: number;
  thisWeekWorkouts: number;
  thisWeekVolume: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  locked: boolean;
  category: 'milestone' | 'streak' | 'strength' | 'consistency';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  weight?: number;
  height?: number;
  experienceLevel: Difficulty;
  goal: Goal;
  joinDate: string;
  isPremium: boolean;
  stats: UserStats;
  level: number;
  xp: number;
  xpNextLevel: number;
  badges: Badge[];
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: number;
}

export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  foods: FoodItem[];
  time: string;
}

export interface NutritionDay {
  date: string;
  meals: Meal[];
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface BodyWeight {
  date: string;
  weight: number;
}

export interface WeeklyVolume {
  week: string;
  volume: number;
  workouts: number;
}

export interface AIInsight {
  id: string;
  type: 'progress' | 'plateau' | 'recommendation' | 'warning' | 'achievement';
  title: string;
  message: string;
  exerciseId?: string;
  createdAt: string;
  icon: string;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userLevel: number;
  content: string;
  type: 'workout' | 'pr' | 'milestone';
  workout?: Partial<Workout>;
  pr?: PersonalRecord;
  likes: number;
  comments: number;
  createdAt: string;
  liked: boolean;
}

export interface ActiveWorkoutState {
  isActive: boolean;
  startTime: number;
  name: string;
  exercises: WorkoutExercise[];
  currentExerciseIndex: number;
  isResting: boolean;
  restTimeRemaining: number;
  notes: string;
}

export type AuthScreen = 'login' | 'register' | 'forgot';

export type AppScreen =
  | 'home' | 'exercises' | 'exercise_detail' | 'workout'
  | 'routines' | 'routine_detail' | 'stats' | 'nutrition'
  | 'community' | 'profile' | 'settings';
