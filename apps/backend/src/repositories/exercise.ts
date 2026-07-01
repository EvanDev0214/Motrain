import { eq, or } from 'drizzle-orm';
import { db } from '@/db/db';
import { exercises } from '@/db/schemas/exercises';

export type CreateExerciseData = Omit<typeof exercises.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>;
export type ReplaceExerciseData = Pick<typeof exercises.$inferInsert, 'name' | 'equipment' | 'defaultWeightMode' | 'mediaUrl'>;

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
  },

  replaceById: async (exerciseId: UUID, data: ReplaceExerciseData) => {
    const [exercise] = await db.update(exercises)
      .set(data)
      .where(eq(exercises.id, exerciseId)).returning();

    return exercise ?? null;
  },

  deleteById: async (exerciseId: UUID) => {
    const [exercise] = await db.delete(exercises)
      .where(eq(exercises.id, exerciseId))
      .returning();

    return exercise ?? null;
  }
};

export type ExerciseRepo = typeof exerciseRepository;
