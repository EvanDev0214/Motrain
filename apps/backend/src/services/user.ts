import { userRepository, type UserRepository } from '@/repositories/user';

export class UserService {
  constructor(
    private userRepository: UserRepository
  ) {}

  async getMe(userId: UUID) {
    const user = await this.userRepository.findByUserId(userId);

    if (!user) {
      throw new Error('Failed to query user.');
    }

    return user;
  }
}

export const userService = new UserService(userRepository);
