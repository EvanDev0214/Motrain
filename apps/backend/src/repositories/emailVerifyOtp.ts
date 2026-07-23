import env from '@/configs/env';
import { db } from '@/db/db';
import { emailVerifyOtps } from '@/db/schemas/emailVerifyOtps';
import { eq, sql } from 'drizzle-orm';

type UpsertEmailVerifyOtpData = Pick<typeof emailVerifyOtps.$inferInsert, 'userId' | 'email' | 'code'>;

export const emailVerifyOtpRepository = {
  upsert: async (data: UpsertEmailVerifyOtpData) => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + env.RESEND_OTP_EXPIRES_MINUTES * 60 * 1000);

    await db.insert(emailVerifyOtps).values({
      userId: data.userId,
      email: data.email,
      code: data.code,
      expiresAt
    }).onConflictDoUpdate({
      target: emailVerifyOtps.userId,
      set: {
        code: data.code,
        attempts: 0,
        expiresAt,
        createdAt: now
      }
    });
  },
  findByEmail: async (email: Email) => {
    const [data] = await db.select().from(emailVerifyOtps)
      .where(eq(emailVerifyOtps.email, email));

    return data;
  },
  incrementAttempts: async (userId: UUID) => {
    await db.update(emailVerifyOtps)
      .set({ attempts: sql`${emailVerifyOtps.attempts} + 1` })
      .where(eq(emailVerifyOtps.userId, userId));
  },
  deleteByUserId: async (userId: UUID) => {
    await db.delete(emailVerifyOtps)
      .where(eq(emailVerifyOtps.userId, userId));
  }
};

export type EmailVerifyOtpRepo = typeof emailVerifyOtpRepository;
