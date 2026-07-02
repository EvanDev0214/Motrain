import { db, type DbTransaction } from '@/db/db';
import { exerciseMuscles } from '@/db/schemas/exerciseMuscles';

export type ExerciseMuscleData = typeof exerciseMuscles.$inferInsert;

export const exerciseMuscleRepository = {
  createMany: async (data: ExerciseMuscleData[], tx?: DbTransaction) => {
    const client = tx ?? db;
    await client.insert(exerciseMuscles).values(data);
  }
};

export type ExerciseMuscleRepo = typeof exerciseMuscleRepository;
