import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const muscles = pgTable('muscles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 64 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date())
});
