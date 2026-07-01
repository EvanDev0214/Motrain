import { exerciseRepository, type ExerciseRepo } from '@/repositories/exercise';
import type { CreateUserExerciseRequest, ReplaceExerciseBody } from '@/schemas/exercise';
import { Forbidden403Error, NotFound404Error } from '@/utils/error';

export class ExerciseService {
  constructor(
    private exerciseRepository: ExerciseRepo
  ) {}

  async getExercises(userId: UUID) {
    return await this.exerciseRepository.findAvailableForUser(userId);
  }

  async createUserExercise(userId: UUID, data: CreateUserExerciseRequest) {
    return await this.exerciseRepository.create({
      userId,
      name: data.name,
      equipment: data.equipment,
      defaultWeightMode: data.defaultWeightMode,
      mediaUrl: data.mediaUrl,
      isSystem: false
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

    const updated = await this.exerciseRepository.replaceById(exerciseId, data);

    if (!updated) {
      throw new NotFound404Error('The exercise does not exist or has been deleted.', 'EXERCISE_NOT_FOUND');
    }

    return updated;
  }

  async deleteExerciseById(userId: UUID, exerciseId: UUID) {
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

    const deleted = await this.exerciseRepository.deleteById(exerciseId);

    if (!deleted) {
      throw new NotFound404Error('The exercise does not exist or has been deleted.', 'EXERCISE_NOT_FOUND');
    }

    return deleted;
  }
}

export const exerciseService = new ExerciseService(exerciseRepository);
