import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ActiveWorkoutState, WorkoutExercise, WorkoutSet, Routine } from '../types';
import { mockWorkouts, mockRoutines } from '../data/mockData';
import type { Workout } from '../types';

interface WorkoutContextValue {
  activeWorkout: ActiveWorkoutState | null;
  workouts: Workout[];
  routines: Routine[];
  startWorkout: (name: string, exercises: WorkoutExercise[]) => void;
  startFromRoutine: (routine: Routine) => void;
  updateSet: (exerciseIdx: number, setIdx: number, data: Partial<WorkoutSet>) => void;
  addSet: (exerciseIdx: number) => void;
  removeSet: (exerciseIdx: number, setIdx: number) => void;
  finishWorkout: () => Workout | null;
  discardWorkout: () => void;
  addRoutine: (routine: Routine) => void;
  updateRoutine: (routine: Routine) => void;
  deleteRoutine: (id: string) => void;
}

const WorkoutContext = createContext<WorkoutContextValue>({} as WorkoutContextValue);

const makeBlankSets = (count: number): WorkoutSet[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `set-${i}-${Date.now()}`,
    reps: undefined, weight: undefined,
    completed: false, rpe: undefined,
  }));

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkoutState | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>(mockWorkouts);
  const [routines, setRoutines] = useState<Routine[]>(mockRoutines);

  const startWorkout = useCallback((name: string, exercises: WorkoutExercise[]) => {
    setActiveWorkout({
      isActive: true,
      startTime: Date.now(),
      name,
      exercises,
      currentExerciseIndex: 0,
      isResting: false,
      restTimeRemaining: 0,
      notes: '',
    });
  }, []);

  const startFromRoutine = useCallback((routine: Routine) => {
    const exercises: WorkoutExercise[] = routine.exercises.map(re => ({
      id: `we-${re.id}-${Date.now()}`,
      exerciseId: re.exerciseId,
      exercise: re.exercise,
      restTime: re.restTime,
      sets: makeBlankSets(re.sets),
    }));
    startWorkout(routine.name, exercises);
  }, [startWorkout]);

  const updateSet = useCallback((exerciseIdx: number, setIdx: number, data: Partial<WorkoutSet>) => {
    setActiveWorkout(prev => {
      if (!prev) return prev;
      const exercises = [...prev.exercises];
      const ex = { ...exercises[exerciseIdx] };
      const sets = [...ex.sets];
      sets[setIdx] = { ...sets[setIdx], ...data };
      ex.sets = sets;
      exercises[exerciseIdx] = ex;
      return { ...prev, exercises };
    });
  }, []);

  const addSet = useCallback((exerciseIdx: number) => {
    setActiveWorkout(prev => {
      if (!prev) return prev;
      const exercises = [...prev.exercises];
      const ex = { ...exercises[exerciseIdx] };
      const lastSet = ex.sets[ex.sets.length - 1];
      ex.sets = [...ex.sets, {
        id: `set-${ex.sets.length}-${Date.now()}`,
        reps: lastSet?.reps, weight: lastSet?.weight,
        completed: false,
      }];
      exercises[exerciseIdx] = ex;
      return { ...prev, exercises };
    });
  }, []);

  const removeSet = useCallback((exerciseIdx: number, setIdx: number) => {
    setActiveWorkout(prev => {
      if (!prev) return prev;
      const exercises = [...prev.exercises];
      const ex = { ...exercises[exerciseIdx] };
      ex.sets = ex.sets.filter((_, i) => i !== setIdx);
      exercises[exerciseIdx] = ex;
      return { ...prev, exercises };
    });
  }, []);

  const finishWorkout = useCallback((): Workout | null => {
    if (!activeWorkout) return null;
    const duration = Math.round((Date.now() - activeWorkout.startTime) / 60000);
    let totalVolume = 0, totalSets = 0, totalReps = 0;
    for (const ex of activeWorkout.exercises) {
      for (const s of ex.sets) {
        if (s.completed && s.weight && s.reps) {
          totalVolume += s.weight * s.reps;
          totalReps += s.reps;
          totalSets++;
        }
      }
    }
    const workout: Workout = {
      id: `w-${Date.now()}`,
      name: activeWorkout.name,
      date: new Date().toISOString().split('T')[0],
      duration: Math.max(duration, 1),
      exercises: activeWorkout.exercises,
      volume: totalVolume,
      totalSets,
      totalReps,
      notes: activeWorkout.notes,
    };
    setWorkouts(prev => [workout, ...prev]);
    setActiveWorkout(null);
    return workout;
  }, [activeWorkout]);

  const discardWorkout = useCallback(() => setActiveWorkout(null), []);

  const addRoutine = useCallback((routine: Routine) => {
    setRoutines(prev => [...prev, routine]);
  }, []);

  const updateRoutine = useCallback((routine: Routine) => {
    setRoutines(prev => prev.map(r => r.id === routine.id ? routine : r));
  }, []);

  const deleteRoutine = useCallback((id: string) => {
    setRoutines(prev => prev.filter(r => r.id !== id));
  }, []);

  return (
    <WorkoutContext.Provider value={{
      activeWorkout, workouts, routines,
      startWorkout, startFromRoutine,
      updateSet, addSet, removeSet,
      finishWorkout, discardWorkout,
      addRoutine, updateRoutine, deleteRoutine,
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => useContext(WorkoutContext);
