import { exerciseRepository, type ExerciseRepo } from '@/repositories/exercise';

export class ExerciseService {
  constructor(
    private exerciseRepository: ExerciseRepo
  ) {}

  async getExercises(userId: UUID) {
    return await this.exerciseRepository.findAvailableForUser(userId);
  }
}

export const exerciseService = new ExerciseService(exerciseRepository);
