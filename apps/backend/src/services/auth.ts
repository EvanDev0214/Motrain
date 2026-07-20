import argon2 from 'argon2';
import type { RegisterInput } from '@/schemas/auth';
import { userRepository, type UserRepo } from '@/repositories/user';
import { refreshTokensRepository, type RefreshTokensRepository } from '@/repositories/refreshTokens';
import { BadRequest400Error, Unauthorized401Error } from '@/utils/error';
import { generateJwt } from '@/utils/jwt';
import { emailVerificationService, type EmailVerificationService } from '@/services/emailVerification';
import { emailService, type EmailService } from '@/services/email';

class AuthService {
  constructor(
    private userRepository: UserRepo,
    private refreshTokensRepository: RefreshTokensRepository,
    private emailVerificationService: EmailVerificationService,
    private emailService: EmailService
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

  async login(email: Email, password: string) {
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

  async refreshToken(token: string, payload: UserJwtPayload) {
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

  async logout(token: string, userId: UUID) {
    const storedToken = await this.refreshTokensRepository.findByUserId(userId);

    if (!storedToken) {
      throw new Unauthorized401Error('Invalid request, please login again', 'INVALID_TOKEN');
    }

    const isTokenValid = await argon2.verify(storedToken.refreshTokenHash, token);

    if (!isTokenValid) {
      throw new Unauthorized401Error('Invalid request, please login again', 'INVALID_TOKEN');
    }

    await this.refreshTokensRepository.deleteByUserId(userId);
  }

  async updatePassword(
    userId: UUID,
    oldPassword: string,
    newPassword: string
  ) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Unauthorized401Error('User not found', 'INVALID_TOKEN');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, oldPassword);

    if (!isPasswordValid) {
      throw new BadRequest400Error('Old password is incorrect', 'INVALID_PASSWORD');
    }

    const passwordHash = await argon2.hash(newPassword);
    await this.userRepository.updatePasswordByUserId(userId, passwordHash);
  }

  async verifyEmailOTP(email: Email, otp: string) {
    const { userId } = await this.emailVerificationService.verifyOTP(email, otp);
    await this.userRepository.markEmailAsVerified(userId);
  }

  async verifyPasswordOTP(email: Email, otp: string) {
    const { userId } = await this.emailVerificationService.verifyOTP(email, otp);

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Unauthorized401Error('User not found', 'INVALID_TOKEN');
    }

    if (!user.emailVerifiedAt) {
      await this.userRepository.markEmailAsVerified(userId);
    }

    const resetToken = generateJwt('PASSWORD_RESET', { email: user.email, userId: user.id });

    return { resetToken };
  }

  async resetPassword(userId: UUID, newPassword: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Unauthorized401Error('User not found', 'INVALID_TOKEN');
    }

    const passwordHash = await argon2.hash(newPassword);
    await this.userRepository.updatePasswordByUserId(userId, passwordHash);

    await this.refreshTokensRepository.deleteByUserId(userId);

    await this.emailService.sendPasswordResetConfirmationEmail(user.email);
  }

  async forgotPassword(email: Email) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) return;

    await this.emailVerificationService.sendOTP(user.id, user.email, 'password_reset');
  }
}

export const authService = new AuthService(
  userRepository,
  refreshTokensRepository,
  emailVerificationService,
  emailService
);
