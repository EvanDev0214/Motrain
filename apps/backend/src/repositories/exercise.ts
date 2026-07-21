import { eq, or, and, inArray, desc, asc } from 'drizzle-orm';
import { db, type DbTransaction } from '@/db/db';
import { exercises } from '@/db/schemas/exercises';
import { sets, workoutExercises, workouts } from '@/db/schemas';

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

  findAllByIds: async (exerciseIds: UUID[], userId: UUID) => {
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
  },

  history: async (exerciseId: UUID, userId: UUID) => {
    return await db.select({
      workoutId: workouts.id,
      workoutName: workouts.name,
      workoutDate: workouts.createdAt,
      setOrder: sets.order,
      setType: sets.setType,
      weight: sets.weight,
      weightLeft: sets.weightLeft,
      weightRight: sets.weightRight,
      reps: sets.reps,
      rpe: sets.rpe,
      restSeconds: sets.restSeconds,
      note: sets.note
    })
      .from(workoutExercises)
      .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
      .innerJoin(sets, eq(sets.workoutExerciseId, workoutExercises.id))
      .where(
        and(
          eq(workoutExercises.exerciseId, exerciseId),
          eq(workouts.userId, userId)
        )
      )
      .orderBy(
        desc(workouts.createdAt),
        asc(sets.order)
      );
  }
};

export type ExerciseRepo = typeof exerciseRepository;
