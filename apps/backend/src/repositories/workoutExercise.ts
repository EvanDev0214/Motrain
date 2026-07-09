import { db, type DbTransaction } from '@/db/db';
import { workoutExercises } from '@/db/schemas';

type CreateWorkoutExerciseData = Omit<typeof workoutExercises.$inferInsert, 'id'>;

export const workoutExerciseRepository = {
  create: async (data: CreateWorkoutExerciseData, tx?: DbTransaction) => {
    const client = tx ?? db;
    const [workoutExercise] = await client.insert(workoutExercises)
      .values(data)
      .returning();

    return workoutExercise ?? null;
  },
  createMany: async (data: CreateWorkoutExerciseData[], tx?: DbTransaction) => {
    const client = tx ?? db;
    return await client.insert(workoutExercises)
      .values(data)
      .returning();
  }
};

export type WorkoutExerciseRepo = typeof workoutExerciseRepository;
