import { pgTable, uuid, boolean, varchar, pgEnum, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from '@/db/schemas/users';

export const defaultWeightModeEnum = pgEnum('default_weight_mode', ['single', 'bilateral']);
export const equipmentEnum = pgEnum('equipment', [
  'barbell',
  'dumbbell',
  'cable',
  'smith_machine',
  'machine',
  'plate_loaded_machine',
  'kettlebell',
  'bodyweight',
  'other'
]);

export const exercises = pgTable('exercises', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  isSystem: boolean('is_system').notNull().default(false),
  name: varchar('name', { length: 64 }).notNull(),
  equipment: equipmentEnum('equipment').notNull(),
  defaultWeightMode: defaultWeightModeEnum('default_weight_mode').notNull().default('single'),
  mediaUrl: varchar('media_url', { length: 500 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date())
}, (table) => [
  uniqueIndex('system_exercise_name_idx')
    .on(table.name)
    .where(sql`${table.isSystem} = true`)
]);
