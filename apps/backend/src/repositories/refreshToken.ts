import { eq } from 'drizzle-orm';
import { db } from '@/db/db';
import ms, { type StringValue } from 'ms';
import { refreshTokens } from '@/db/schemas/refreshTokens';
import env from '@/configs/env';

type UpsertRefreshTokenData = Pick<typeof refreshTokens.$inferInsert, 'userId' | 'refreshTokenHash'>;

export const refreshTokenRepository = {
  upsert: async (data: UpsertRefreshTokenData) => {
    const expiresMs = ms(env.JWT_REFRESH_EXPIRES_IN as StringValue);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiresMs);

    await db.insert(refreshTokens).values({
      userId: data.userId,
      refreshTokenHash: data.refreshTokenHash,
      expiresAt
    }).onConflictDoUpdate({
      target: refreshTokens.userId,
      set: {
        refreshTokenHash: data.refreshTokenHash,
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
  },
  deleteByUserId: async (userId: UUID) => {
    await db.delete(refreshTokens)
      .where(eq(refreshTokens.userId, userId));
  }
};

export type RefreshTokenRepo = typeof refreshTokenRepository;
