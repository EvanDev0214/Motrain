import { relations } from 'drizzle-orm';
import { exercises } from '@/db/schemas/exercises';
import { exerciseMuscles } from '@/db/schemas/exerciseMuscles';
import { muscles } from '@/db/schemas/muscles';

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
