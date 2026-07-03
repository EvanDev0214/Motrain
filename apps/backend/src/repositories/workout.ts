import { db } from '@/db/db';
import { workouts } from '@/db/schemas/workouts';

type CreateWorkoutData = Omit<typeof workouts.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>;

export const workoutRepository = {
  create: async (data: CreateWorkoutData) => {
    const [workout] = await db.insert(workouts).values(data).returning();

    return workout ?? null;
  }
};

export type WorkoutRepo = typeof workoutRepository;
