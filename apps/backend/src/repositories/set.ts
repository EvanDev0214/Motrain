import { db, type DbTransaction } from '@/db/db';
import { sets } from '@/db/schemas';

type CreateSetData = Required<Omit<typeof sets.$inferInsert, 'id'>>;

export const setRepository = {
  createMany: async (data: CreateSetData[], tx?: DbTransaction) => {
    const client = tx ?? db;
    await client.insert(sets).values(data);
  }
};

export type SetRepo = typeof setRepository;
