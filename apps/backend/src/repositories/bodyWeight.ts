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

  findOneById: async (bodyWeightId: UUID) => {
    const bodyWeight = await db.query.bodyWeights.findFirst({
      where: eq(bodyWeights.id, bodyWeightId)
    });

    return bodyWeight ?? null;
  },

  upsert: async (data: CreateBodyWeightData) => {
    const [upsertedBodyWeight] = await db.insert(bodyWeights).values(data)
      .onConflictDoUpdate({
        target: [bodyWeights.userId, bodyWeights.recordedAt],
        set: { weight: data.weight }
      })
      .returning({
        id: bodyWeights.id,
        weight: bodyWeights.weight,
        recordedAt: bodyWeights.recordedAt
      });

    return upsertedBodyWeight ?? null;
  },

  deleteById: async (bodyWeightId: UUID) => {
    await db.delete(bodyWeights).where(eq(bodyWeights.id, bodyWeightId));
  }
};

export type BodyWeightRepo = typeof bodyWeightRepository;
