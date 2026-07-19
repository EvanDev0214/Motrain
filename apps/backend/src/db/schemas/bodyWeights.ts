import { numeric, pgTable, uuid, timestamp, unique } from 'drizzle-orm/pg-core';
import { users } from '@/db/schemas/users';

export const bodyWeights = pgTable('body_weights', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  weight: numeric('weight', { precision: 6, scale: 2 }).notNull(),
  recordedAt: timestamp('recorded_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date())
}, (table) => [
  unique().on(table.userId, table.recordedAt)
]);
