import { pgTable, uuid, pgEnum, primaryKey } from 'drizzle-orm/pg-core';
import { exercises } from '@/db/schemas/exercises';
import { muscles } from '@/db/schemas/muscles';

export const muscleRoleEnum = pgEnum('muscle_role', ['primary', 'secondary']);

export const exerciseMuscles = pgTable('exercise_muscles', {
  exerciseId: uuid('exercise_id').notNull().references(() => exercises.id, { onDelete: 'cascade' }),
  muscleId: uuid('muscle_id').notNull().references(() => muscles.id, { onDelete: 'cascade' }),
  muscleRole: muscleRoleEnum().notNull()
}, (table) => [
  primaryKey({ columns: [table.exerciseId, table.muscleId] })
]);
