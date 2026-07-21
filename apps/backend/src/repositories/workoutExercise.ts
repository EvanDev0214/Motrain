import { eq } from 'drizzle-orm';
import { db, type DbTransaction } from '@/db/db';
import { workoutExercises } from '@/db/schemas';

type CreateWorkoutExerciseData = Omit<typeof workoutExercises.$inferInsert, 'id'>;

export const workoutExerciseRepository = {
  createMany: async (data: CreateWorkoutExerciseData[], tx?: DbTransaction) => {
    const client = tx ?? db;
    return await client.insert(workoutExercises)
      .values(data)
      .returning();
  },
  deleteByWorkoutId: async (workoutId: UUID, tx?: DbTransaction) => {
    const client = tx ?? db;
    await client.delete(workoutExercises)
      .where(eq(workoutExercises.workoutId, workoutId));
  }
};

export type WorkoutExerciseRepo = typeof workoutExerciseRepository;
