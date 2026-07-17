import { desc, eq } from 'drizzle-orm';
import { db } from '@/db/db';
import { workouts } from '@/db/schemas/workouts';

type CreateWorkoutData = Omit<typeof workouts.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>;
type ReplaceWorkoutData = Omit<CreateWorkoutData, 'userId'>;

export const workoutRepository = {
  // TODO: 這個命名有問題
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
  },

  findOneById: async (workoutId: UUID) => {
    const workout = await db.query.workouts.findFirst({
      where: eq(workouts.id, workoutId),
      with: {
        workoutExercises: {
          orderBy: (workoutExercises, { asc }) => [asc(workoutExercises.order)],
          with: {
            sets: {
              orderBy: (sets, { asc }) => [asc(sets.order)]
            },
            exercise: true
          }
        }
      }
    });

    return workout ?? null;
  },

  replaceById: async (workoutId: UUID, data: ReplaceWorkoutData) => {
    const [updatedWorkout] = await db.update(workouts)
      .set({
        name: data.name,
        reflections: data.reflections
      })
      .where(eq(workouts.id, workoutId)).returning();

    return updatedWorkout ?? null;
  },

  deleteById: async (workoutId: UUID) => {
    await db.delete(workouts).where(eq(workouts.id, workoutId));
  }
};

export type WorkoutRepo = typeof workoutRepository;
