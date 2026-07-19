import { eq, desc } from 'drizzle-orm';
import { db } from '@/db/db';
import { bodyWeights } from '@/db/schemas';

type CreateBodyWeightData = Pick<typeof bodyWeights.$inferInsert, 'userId' | 'weight' | 'recordedAt'>;

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
  },

  upsert: async (data: CreateBodyWeightData) => {
    const [upsertedbodyWeight] = await db.insert(bodyWeights).values(data)
      .onConflictDoUpdate({
        target: [bodyWeights.userId, bodyWeights.recordedAt],
        set: { weight: data.weight }
      })
      .returning({
        id: bodyWeights.id,
        weight: bodyWeights.weight,
        recordedAt: bodyWeights.recordedAt
      });

    return upsertedbodyWeight ?? null;
  }
};

export type BodyWeightRepo = typeof bodyWeightRepository;
