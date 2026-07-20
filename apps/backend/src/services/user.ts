import { userRepository, type UserRepo } from '@/repositories/user';

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
}

export const userService = new UserService(userRepository);
