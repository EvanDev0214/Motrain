
import { db } from '@/db/db';
import { emailVerifyOtps } from '@/db/schemas/emailVerifyOtps';

export const emailVerifyOtpsRepository = {
  upsert: async (
    userId: UUID,
    email: Email,
    otp: string
  ) => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + Number(process.env.RESEND_OTP_EXPIRES_MINUTES) * 60 * 1000);

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
  }
};

export type EmailVerifyOtpsRepository = typeof emailVerifyOtpsRepository;
