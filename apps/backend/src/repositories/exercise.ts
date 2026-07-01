import { eq, or } from 'drizzle-orm';
import { db } from '@/db/db';
import { exercises } from '@/db/schemas/exercises';

export type CreateExerciseData = Omit<typeof exercises.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>;

export const exerciseRepository = {
  findAvailableForUser: async (userId: UUID) => {
    return await db.select().from(exercises)
      .where(or(
        eq(exercises.isSystem, true),
        eq(exercises.userId, userId)
      ));
  },

  create: async (data: CreateExerciseData) => {
    const [exercise] = await db.insert(exercises).values(data).returning();
    return exercise;
  },

  findById: async (exerciseId: UUID) => {
    const [exercise] = await db.select().from(exercises)
      .where(eq(exercises.id, exerciseId))
      .limit(1);

    return exercise ?? null;
  }
};

export type ExerciseRepo = typeof exerciseRepository;
