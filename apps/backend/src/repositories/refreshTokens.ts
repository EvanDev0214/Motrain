import { db } from '@/db/db';
import { refreshTokens } from '@/db/schemas/refreshTokens';
import env from '@/configs/env';

export const refreshTokensRepository = {
  upsert: async (
    userId: UUID,
    refreshTokenHash: string
  ) => {
    const expiresDays = parseInt(env.JWT_REFRESH_EXPIRES_IN);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiresDays * 24 * 60 * 60 * 1000);

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
  }
};

export type RefreshTokensRepository = typeof refreshTokensRepository;
