import { userRepository, type UserRepo } from '@/repositories/user';
import type { UpdateUserProfileBody } from '@/schemas/user';

export class UserService {
  constructor(
    private userRepository: UserRepo
  ) {}

  async getMe(userId: UUID) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('Failed to query user.');
    }

    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      avatarUrl: user.avatarUrl,
      weightUnit: user.weightUnit,
      emailVerifiedAt: user.emailVerifiedAt
    };
  }

  async updateUserProfile(userId: UUID, data: UpdateUserProfileBody) {
    if (Object.keys(data).length === 0) return null;

    await this.userRepository.updateUserById(userId, data);
    return await this.getMe(userId);
  }
}

export const userService = new UserService(userRepository);
