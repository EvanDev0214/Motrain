import { inArray } from 'drizzle-orm';
import { db, type DbTransaction } from '@/db/db';
import { muscles } from '@/db/schemas/muscles';

export const muscleRepository = {
  findAll: async () => {
    return await db.select().from(muscles);
  },

  findAllByIds: async (muscleIds: UUID[], tx?: DbTransaction) => {
    const client = tx ?? db;
    return await client.select().from(muscles)
      .where(inArray(muscles.id, muscleIds));
  }
};

export type MuscleRepo = typeof muscleRepository;
