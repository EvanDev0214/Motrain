import {
  db,
  type DbClient,
  type DbTransaction
} from '@/db/db';
import { exerciseRepository, type ExerciseRepo } from '@/repositories/exercise';
import { setRepository, type SetRepo } from '@/repositories/set';
import { workoutRepository, type WorkoutRepo } from '@/repositories/workout';
import { workoutExerciseRepository, type WorkoutExerciseRepo } from '@/repositories/workoutExercise';
import type {
  CreateUserWorkoutBody,
  CreateUserWorkoutExercisesBody,
  ReplaceUserWorkoutBody,
  ReplaceUserWorkoutExercisesBody
} from '@/schemas/workout';
import { InternalServerError, NotFound404Error } from '@/utils/error';

export class WorkoutService {
  constructor(
    private db: DbClient,
    private workoutRepository: WorkoutRepo,
    private exerciseRepository: ExerciseRepo,
    private workoutExerciseRepository: WorkoutExerciseRepo,
    private setRepository: SetRepo
  ) {}

  private async findUserWorkoutOrThrow(userId: UUID, workoutId: UUID) {
    const workout = await this.workoutRepository.findById(workoutId);

    if (!workout) {
      throw new NotFound404Error('The workout does not exist or has been deleted.', 'WORKOUT_NOT_FOUND');
    }

    if (workout.userId !== userId) {
      throw new NotFound404Error('The workout does not exist or has been deleted.', 'WORKOUT_NOT_FOUND');
    }

    return workout;
  }

  private async saveWorkoutExercises(
    userId: UUID,
    workoutId: UUID,
    data: CreateUserWorkoutExercisesBody,
    tx: DbTransaction
  ) {
    const uniqueExerciseIds = [... new Set(data.exercises.map(exercise => exercise.exerciseId))];

    const exercises = await this.exerciseRepository.findAllByIds(uniqueExerciseIds, userId);

    if (exercises.length !== uniqueExerciseIds.length) {
      throw new NotFound404Error('The exercise does not exist or has been deleted.', 'EXERCISE_NOT_FOUND');
    }

    const createdWorkoutExercises = await this.workoutExerciseRepository.createMany(
      data.exercises.map(exercise => ({
        exerciseId: exercise.exerciseId,
        supersetId: exercise.supersetId,
        workoutId: workoutId,
        order: exercise.order
      })), tx);

    const allSets = data.exercises.flatMap(exercise => {
      const workoutExercise = createdWorkoutExercises.find(we => we.order === exercise.order);

      if (!workoutExercise) {
        throw new InternalServerError('Failed to match workout exercise.');
      }

      return exercise.sets.map(set => ({
        workoutExerciseId: workoutExercise.id,
        ...set
      }));
    });

    if (allSets.length > 0) {
      await this.setRepository.createMany(allSets, tx);
    }
  }

  async getWorkouts(userId: UUID) {
    return await this.workoutRepository.findAllByUserId(userId);
  }

  async getWorkoutDetails(userId: UUID, workoutId: UUID) {
    const workout = await this.findUserWorkoutOrThrow(userId, workoutId);

    return workout;
  }

  async createUserWorkout(userId: UUID, data: CreateUserWorkoutBody) {
    const workout = await this.workoutRepository.create({ userId, ...data });

    if (!workout) {
      throw new InternalServerError('Failed to create workout.');
    }

    return workout;
  }

  async createUserWorkoutExercises(
    userId: UUID,
    workoutId: UUID,
    data: CreateUserWorkoutExercisesBody
  ) {
    const workout = await this.findUserWorkoutOrThrow(userId, workoutId);

    await this.db.transaction(async (tx) => {
      await this.saveWorkoutExercises(userId, workout.id, data, tx);
    });

    return await this.workoutRepository.findById(workoutId);
  }

  async replaceUserWorkoutExercises(
    userId: UUID,
    workoutId: UUID,
    data: ReplaceUserWorkoutExercisesBody
  ) {
    const workout = await this.findUserWorkoutOrThrow(userId, workoutId);

    await this.db.transaction(async (tx) => {
      await this.workoutExerciseRepository.deleteByWorkoutId(workout.id, tx);
      await this.saveWorkoutExercises(userId, workout.id, data, tx);
    });

    return await this.workoutRepository.findById(workoutId);
  }

  async replaceUserWorkout(
    userId: UUID,
    workoutId: UUID,
    data: ReplaceUserWorkoutBody) {
    await this.findUserWorkoutOrThrow(userId, workoutId);

    const updatedWorkout = await this.workoutRepository.replaceById(workoutId, data);

    if (!updatedWorkout) {
      throw new InternalServerError('Failed to update workout');
    }

    return updatedWorkout;
  }

  async deleteUserWorkout(userId: UUID, workoutId: UUID) {
    await this.findUserWorkoutOrThrow(userId, workoutId);
    await this.workoutRepository.deleteById(workoutId);
  }
}

export const workoutService = new WorkoutService(
  db,
  workoutRepository,
  exerciseRepository,
  workoutExerciseRepository,
  setRepository
);
