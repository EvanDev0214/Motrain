import { desc, eq } from 'drizzle-orm';
import { db } from '@/db/db';
import { workouts } from '@/db/schemas/workouts';

type CreateWorkoutData = Omit<typeof workouts.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>;

export const workoutRepository = {
  findByUserId: async (userId: UUID) => {
    return await db.select({
      id: workouts.id,
      name: workouts.name,
      createdAt: workouts.createdAt
    }).from(workouts)
      .where(eq(workouts.userId, userId))
      .orderBy(desc(workouts.createdAt));
  },

  create: async (data: CreateWorkoutData) => {
    const [workout] = await db.insert(workouts).values(data).returning();

    return workout ?? null;
  }
};

export type WorkoutRepo = typeof workoutRepository;
