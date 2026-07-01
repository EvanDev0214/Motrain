import { muscleRepository, type MuscleRepo } from '@/repositories/muscle';

export class MuscleService {
  constructor(
    private muscleRepository: MuscleRepo
  ) {}

  async getMuscles() {
    return await this.muscleRepository.findAll();
  }
}

export const muscleService = new MuscleService(muscleRepository);
