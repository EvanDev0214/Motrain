import { bodyWeightRepository, type BodyWeightRepo } from '@/repositories/bodyWeight';
import type { CreateBodyWeightBody } from '@/schemas/bodyWeight';

export class BodyWeightService {
  constructor(
    private bodyWeightRepository: BodyWeightRepo
  ) {}

  async getUserBodyWeights(userId: UUID) {
    return await this.bodyWeightRepository.findAllByUserId(userId);
  }

  async createUserBodyWeight(userId: UUID, data: CreateBodyWeightBody) {
    const upsertedBodyWeight = await this.bodyWeightRepository.upsert({ userId, ...data });

    if (!upsertedBodyWeight) {
      throw new Error('Failed to upsert body weight.');
    }

    return upsertedBodyWeight;
  }
}

export const bodyWeightService = new BodyWeightService(bodyWeightRepository);
