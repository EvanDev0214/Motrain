import { exerciseRepository, type ExerciseRepo } from '@/repositories/exercise';
import type { CreateUserExerciseRequest } from '@/schemas/exercise';
import { NotFound404Error } from '@/utils/error';

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
}

export const exerciseService = new ExerciseService(exerciseRepository);
