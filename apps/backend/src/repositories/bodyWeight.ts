import { eq, desc } from 'drizzle-orm';
import { db } from '@/db/db';
import { bodyWeights } from '@/db/schemas';

export const bodyWeightRepository = {
  findAllByUserId: async (userId: UUID) => {
    return await db.select({
      id: bodyWeights.id,
      weight: bodyWeights.weight,
      recordedAt: bodyWeights.recordedAt
    })
      .from(bodyWeights)
      .where(eq(bodyWeights.userId, userId))
      .orderBy(desc(bodyWeights.recordedAt));
  }
};

export type BodyWeightRepo = typeof bodyWeightRepository;
