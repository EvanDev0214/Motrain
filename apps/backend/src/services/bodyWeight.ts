import { bodyWeightRepository, type BodyWeightRepo } from '@/repositories/bodyWeight';

export class BodyWeightService {
  constructor(
    private bodyWeightRepository: BodyWeightRepo
  ) {}

  async getUserBodyWeights(userId: UUID) {
    return await this.bodyWeightRepository.findAllByUserId(userId);
  }
}

export const bodyWeightService = new BodyWeightService(bodyWeightRepository);
