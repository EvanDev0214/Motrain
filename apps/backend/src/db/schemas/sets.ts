import { pgTable, uuid, integer, pgEnum, text, unique, numeric } from 'drizzle-orm/pg-core';
import { workoutExercises } from '@/db/schemas/workoutExercises';

export const setTypeEnum = pgEnum('set_type', ['warmup', 'formal', 'decrease', 'superset']);
export const rpeEnum = pgEnum('rpe', ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10']);

export const sets = pgTable('sets', {
  id: uuid('id').primaryKey().defaultRandom(),
  workoutExerciseId: uuid('workout_exercise_id').notNull().references(() => workoutExercises.id, { onDelete: 'cascade' }),
  order: integer('order').notNull().default(1),
  setType: setTypeEnum('set_type').notNull(),
  weight: numeric('weight', { precision: 6, scale: 2 }),
  weightLeft: numeric('weight_left', { precision: 6, scale: 2 }),
  weightRight: numeric('weight_right', { precision: 6, scale: 2 }),
  reps: integer('reps'),
  rpe: rpeEnum('rpe'),
  note: text('note'),
  restSeconds: integer('rest_seconds')
}, (table) => [
  unique().on(table.workoutExerciseId, table.order)
]);
