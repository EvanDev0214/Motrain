import { pgTable, uuid, integer, unique } from 'drizzle-orm/pg-core';
import { workouts } from '@/db/schemas/workouts';
import { exercises } from '@/db/schemas/exercises';

export const workoutExercises = pgTable('workout_exercises', {
  id: uuid('id').primaryKey().defaultRandom(),
  supersetId: uuid('superset_id'),
  workoutId: uuid('workout_id').notNull().references(() => workouts.id, { onDelete: 'cascade' }),
  exerciseId: uuid('exercise_id').notNull().references(() => exercises.id),
  order: integer('order').notNull().default(1)
}, (table) => [
  unique().on(table.workoutId, table.order)
]);
