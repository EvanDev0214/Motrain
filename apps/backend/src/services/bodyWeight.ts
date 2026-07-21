import { bodyWeightRepository, type BodyWeightRepo } from '@/repositories/bodyWeight';
import type { CreateBodyWeightBody } from '@/schemas/bodyWeight';
import { NotFound404Error } from '@/utils/error';

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

  async deleteUserBodyWeight(userId: UUID, bodyWeightId: UUID) {
    const bodyWeight = await this.bodyWeightRepository.findById(bodyWeightId);

    if (!bodyWeight || bodyWeight.userId !== userId) {
      throw new NotFound404Error('The body weight does not exist or has been deleted.', 'BODY_WEIGHT_NOT_FOUND');
    }

    await this.bodyWeightRepository.deleteById(bodyWeight.id);
  }
}

export const bodyWeightService = new BodyWeightService(bodyWeightRepository);
