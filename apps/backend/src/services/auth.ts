import argon2 from 'argon2';
import type { RegisterInput } from '@/schemas/auth';
import { userRepository, type UserRepository } from '@/repositories/user';

class AuthService {
  constructor(
    private userRepository: UserRepository
  ) {}

  async register(data: RegisterInput) {
    const passwordHash = await argon2.hash(data.password);

    const newUser = await this.userRepository.create({
      nickname: data.nickname,
      email: data.email,
      passwordHash
    });

    return newUser;
  }
}

export const authService = new AuthService(
  userRepository
);
