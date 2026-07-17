import { relations } from 'drizzle-orm';
import { exercises } from '@/db/schemas/exercises';
import { exerciseMuscles } from '@/db/schemas/exerciseMuscles';
import { muscles } from '@/db/schemas/muscles';
import { workouts } from '@/db/schemas/workouts';
import { workoutExercises } from '@/db/schemas/workoutExercises';
import { sets } from '@/db/schemas/sets';

export const exercisesRelations = relations(exercises, ({ many }) => ({
  muscles: many(exerciseMuscles)
}));

export const exerciseMusclesRelations = relations(exerciseMuscles, ({ one }) => ({
  exercise: one(exercises, {
    fields: [exerciseMuscles.exerciseId],
    references: [exercises.id]
  }),
  muscle: one(muscles, {
    fields: [exerciseMuscles.muscleId],
    references: [muscles.id]
  })
}));

export const workoutsRelations = relations(workouts, ({ many }) => ({
  workoutExercises: many(workoutExercises)
}));

export const workoutExercisesRelations = relations(workoutExercises, ({ one, many }) => ({
  workout: one(workouts, {
    fields: [workoutExercises.workoutId],
    references: [workouts.id]
  }),
  exercise: one(exercises, {
    fields: [workoutExercises.exerciseId],
    references: [exercises.id]
  }),
  sets: many(sets)
}));

export const setsRelations = relations(sets, ({ one }) => ({
  workoutExercise: one(workoutExercises, {
    fields: [sets.workoutExerciseId],
    references: [workoutExercises.id]
  })
}));
