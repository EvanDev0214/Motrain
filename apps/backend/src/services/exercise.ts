import { db, type DbClient } from '@/db/db';
import { exerciseRepository, type ExerciseRepo } from '@/repositories/exercise';
import { exerciseMuscleRepository, type ExerciseMuscleRepo } from '@/repositories/exerciseMuscle';
import type { CreateUserExerciseBody, ReplaceExerciseBody } from '@/schemas/exercise';
import { Forbidden403Error, NotFound404Error } from '@/utils/error';

export class ExerciseService {
  constructor(
    private db: DbClient,
    private exerciseRepository: ExerciseRepo,
    private exerciseMuscleRepository: ExerciseMuscleRepo
  ) {}

  private async findUserExerciseOrThrow(userId: UUID, exerciseId: UUID) {
    const exercise = await this.exerciseRepository.findById(exerciseId);

    if (!exercise) {
      throw new NotFound404Error('The exercise does not exist or has been deleted.', 'EXERCISE_NOT_FOUND');
    }

    if (exercise.isSystem) {
      throw new Forbidden403Error('System exercises cannot be modified.', 'EXERCISE_SYSTEM_IMMUTABLE');
    }

    if (exercise.userId !== userId) {
      throw new NotFound404Error('The exercise does not exist or has been deleted.', 'EXERCISE_NOT_FOUND');
    }

    return exercise;
  }

  async getExercises(userId: UUID) {
    return await this.exerciseRepository.findAvailableForUser(userId);
  }

  async createUserExercise(userId: UUID, data: CreateUserExerciseBody) {
    return await this.db.transaction(async (tx) => {
      const exercise = await this.exerciseRepository.create({
        userId,
        name: data.name,
        equipment: data.equipment,
        defaultWeightMode: data.defaultWeightMode,
        mediaUrl: data.mediaUrl,
        isSystem: false
      }, tx);

      if (!exercise) {
        throw new Error('Failed to create exercise.');
      }

      if (data.muscles.length > 0) {
        await this.exerciseMuscleRepository.createMany(
          data.muscles.map(muscle => ({
            exerciseId: exercise.id,
            muscleId: muscle.muscleId,
            muscleRole: muscle.muscleRole
          })), tx);
      }

      return exercise;
    });
  }

  async getExerciseById(userId: UUID, exerciseId: UUID) {
    const exercise = await this.exerciseRepository.findById(exerciseId);

    if (!exercise) {
      throw new NotFound404Error('The exercise does not exist or has been deleted.', 'EXERCISE_NOT_FOUND');
    }

    if (!exercise.isSystem && exercise.userId !== userId) {
      throw new NotFound404Error('The exercise does not exist or has been deleted.', 'EXERCISE_NOT_FOUND');
    }

    return exercise;
  }

  async replaceExerciseById(
    userId: UUID,
    exerciseId: UUID,
    data: ReplaceExerciseBody
  ) {
    await this.findUserExerciseOrThrow(userId, exerciseId);

    return await this.db.transaction(async (tx) => {
      const updated = await this.exerciseRepository.replaceById(exerciseId, data, tx);

      if (!updated) {
        throw new NotFound404Error('The exercise does not exist or has been deleted.', 'EXERCISE_NOT_FOUND');
      }

      await this.exerciseMuscleRepository.deleteByExerciseId(exerciseId, tx);

      if (data.muscles.length > 0) {
        await this.exerciseMuscleRepository.createMany(
          data.muscles.map(muscle => ({
            exerciseId,
            muscleId: muscle.muscleId,
            muscleRole: muscle.muscleRole
          })), tx);
      }

      return updated;
    });
  }

  async deleteExerciseById(userId: UUID, exerciseId: UUID) {
    await this.findUserExerciseOrThrow(userId, exerciseId);

    const deleted = await this.exerciseRepository.deleteById(exerciseId);

    if (!deleted) {
      throw new NotFound404Error('The exercise does not exist or has been deleted.', 'EXERCISE_NOT_FOUND');
    }

    return deleted;
  }
}

export const exerciseService = new ExerciseService(
  db,
  exerciseRepository,
  exerciseMuscleRepository
);
