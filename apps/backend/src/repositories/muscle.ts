import { db } from '@/db/db';
import { muscles } from '@/db/schemas/muscles';

export const muscleRepository = {
  findAll: async () => {
    return await db.select().from(muscles);
  }
};

export type MuscleRepo = typeof muscleRepository;
