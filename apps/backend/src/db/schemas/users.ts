import { pgTable, pgEnum, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const weightUnitEnum = pgEnum('weight_unit', ['kg', 'lb']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  nickname: varchar('nickname', { length: 30 }).notNull(),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  weightUnit: weightUnitEnum('weight_unit').notNull().default('kg'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true })
});
