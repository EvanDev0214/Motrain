import env from '@/configs/env';
import { db } from '@/db/db';
import { emailVerifyOtps } from '@/db/schemas/emailVerifyOtps';
import { eq, sql } from 'drizzle-orm';

export const emailVerifyOtpsRepository = {
  upsert: async (
    userId: UUID,
    email: Email,
    otp: string
  ) => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + env.RESEND_OTP_EXPIRES_MINUTES * 60 * 1000);

    await db.insert(emailVerifyOtps).values({
      userId,
      email,
      code: otp,
      expiresAt
    }).onConflictDoUpdate({
      target: emailVerifyOtps.userId,
      set: {
        code: otp,
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

export type EmailVerifyOtpsRepo = typeof emailVerifyOtpsRepository;
