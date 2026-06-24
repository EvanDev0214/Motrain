import argon2 from 'argon2';
import type { RegisterInput } from '@/schemas/auth';
import { userRepository, type UserRepository } from '@/repositories/user';
import { refreshTokensRepository, type RefreshTokensRepository } from '@/repositories/refreshTokens';
import { Unauthorized401Error } from '@/utils/error';
import { generateJwt } from '@/utils/jwt';

class AuthService {
  constructor(
    private userRepository: UserRepository,
    private refreshTokensRepository: RefreshTokensRepository
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

  async login(
    email: Email,
    password: string
  ) {
    const user = await this.userRepository.findByEmail(email);

    if (!user || !user.emailVerifiedAt) {
      throw new Unauthorized401Error('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const passwordCheck = await argon2.verify(user.passwordHash, password);

    if (!passwordCheck) {
      throw new Unauthorized401Error('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const accessToken = generateJwt('ACCESS', { email: user.email, userId: user.id });
    const refreshToken = generateJwt('REFRESH', { email: user.email, userId: user.id });
    const refreshTokenHash = await argon2.hash(refreshToken);

    await this.refreshTokensRepository.upsert(user.id, refreshTokenHash);

    return {
      accessToken,
      refreshToken
    };
  }

  async refreshToken(
    token: string,
    payload: UserJwtPayload
  ) {
    const storedToken = await this.refreshTokensRepository.findByUserId(payload.userId);

    if (!storedToken) {
      throw new Unauthorized401Error('Invalid request, please login again', 'INVALID_TOKEN');
    }

    const isTokenValid = await argon2.verify(storedToken.refreshTokenHash, token);

    if (!isTokenValid) {
      throw new Unauthorized401Error('Invalid request, please login again', 'INVALID_TOKEN');
    }

    const newAccessToken = generateJwt('ACCESS', {
      email: payload.email,
      userId: payload.userId
    });
    const newRefreshToken = generateJwt('REFRESH', {
      email: payload.email,
      userId: payload.userId
    });

    const refreshTokenHash = await argon2.hash(newRefreshToken);
    await this.refreshTokensRepository.upsert(payload.userId, refreshTokenHash);

    return { newAccessToken, newRefreshToken };
  }

}

export const authService = new AuthService(
  userRepository,
  refreshTokensRepository
);
