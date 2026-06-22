import { pgTable, timestamp, uuid, varchar, integer } from 'drizzle-orm/pg-core';
import { users } from '@/db/schemas/users';

export const emailVerifyOtps = pgTable('email_verify_otps', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique().references(() => users.id),
  email: varchar('email', { length: 255 }).notNull().unique(),
  code: varchar('code', { length: 6 }).notNull(),
  attempts: integer('attempts').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull()
});
