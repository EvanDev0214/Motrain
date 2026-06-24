import { eq } from 'drizzle-orm';
import { db } from '@/db/db';
import ms, { type StringValue } from 'ms';
import { refreshTokens } from '@/db/schemas/refreshTokens';
import env from '@/configs/env';

export const refreshTokensRepository = {
  upsert: async (
    userId: UUID,
    refreshTokenHash: string
  ) => {
    const expiresMs = ms(env.JWT_REFRESH_EXPIRES_IN as StringValue);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiresMs);

    await db.insert(refreshTokens).values({
      userId,
      refreshTokenHash,
      expiresAt
    }).onConflictDoUpdate({
      target: refreshTokens.userId,
      set: {
        refreshTokenHash,
        createdAt: now,
        expiresAt
      }
    });
  },
  findByUserId: async (userId: UUID) => {
    const result = await db.select().from(refreshTokens)
      .where(eq(refreshTokens.userId, userId))
      .limit(1);

    return result[0];
  }
};

export type RefreshTokensRepository = typeof refreshTokensRepository;
