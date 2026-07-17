import { eq, or, and, inArray } from 'drizzle-orm';
import { db, type DbTransaction } from '@/db/db';
import { exercises } from '@/db/schemas/exercises';

export type CreateExerciseData = Omit<typeof exercises.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>;
export type ReplaceExerciseData = Pick<typeof exercises.$inferInsert, 'name' | 'equipment' | 'defaultWeightMode' | 'mediaUrl'>;

export const exerciseRepository = {
  findAvailableForUser: async (userId: UUID) => {
    const rows = await db.query.exercises.findMany({
      where: or(
        eq(exercises.isSystem, true),
        eq(exercises.userId, userId)
      ),
      with: {
        muscles: true
      }
    });

    return rows.map((exercise) => ({
      ...exercise,
      muscles: exercise.muscles.map((exerciseMuscle) => ({
        muscleId: exerciseMuscle.muscleId,
        muscleRole: exerciseMuscle.muscleRole
      }))
    }));
  },

  create: async (data: CreateExerciseData, tx?: DbTransaction) => {
    const client = tx ?? db;
    const [exercise] = await client.insert(exercises)
      .values(data)
      .returning();

    return exercise ?? null;
  },

  findById: async (exerciseId: UUID) => {
    const exercise = await db.query.exercises.findFirst({
      where: eq(exercises.id, exerciseId),
      with: {
        muscles: true
      }
    });

    if (!exercise) return null;

    return {
      ...exercise,
      muscles: exercise.muscles.map((exerciseMuscle) => ({
        muscleId: exerciseMuscle.muscleId,
        muscleRole: exerciseMuscle.muscleRole
      }))
    };
  },

  findManyByIds: async (exerciseIds: UUID[], userId: UUID) => {
    return await db.select().from(exercises)
      .where(
        and(
          inArray(exercises.id, exerciseIds),
          or(
            eq(exercises.isSystem, true),
            eq(exercises.userId, userId)
          )
        )
      );
  },

  replaceById: async (
    exerciseId: UUID,
    data: ReplaceExerciseData,
    tx?: DbTransaction
  ) => {
    const client = tx ?? db;
    const [exercise] = await client.update(exercises)
      .set({
        name: data.name,
        equipment: data.equipment,
        defaultWeightMode: data.defaultWeightMode,
        mediaUrl: data.mediaUrl
      })
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
