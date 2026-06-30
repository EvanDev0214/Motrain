import { exerciseRepository, type ExerciseRepo } from '@/repositories/exercise';
import type { CreateUserExerciseRequest } from '@/schemas/exercise';

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
}

export const exerciseService = new ExerciseService(exerciseRepository);
