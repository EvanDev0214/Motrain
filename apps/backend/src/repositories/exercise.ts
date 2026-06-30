import { eq, or } from 'drizzle-orm';
import { db } from '@/db/db';
import { exercises } from '@/db/schemas/exercises';

export const exerciseRepository = {
  findAvailableForUser: async (userId: UUID) => {
    return await db.select().from(exercises)
      .where(or(
        eq(exercises.isSystem, true),
        eq(exercises.userId, userId)
      ));
  }
};

export type ExerciseRepo = typeof exerciseRepository;
