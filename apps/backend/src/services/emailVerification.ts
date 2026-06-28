import env from '@/configs/env';
import { emailService, type EmailService } from '@/services/email';
import { emailVerifyOtpsRepository, type EmailVerifyOtpsRepository } from '@/repositories/emailVerifyOtps';
import { generateOTP } from '@/utils/otp';
import { BadRequest400Error } from '@/utils/error';

type OtpPurpose = 'email_verify' | 'password_reset';

export class EmailVerificationService {
  constructor(
    private emailVerifyOtpsRepository: EmailVerifyOtpsRepository,
    private emailService: EmailService
  ) {}

  async sendOTP(
    userId: UUID,
    to: Email,
    purpose: OtpPurpose = 'email_verify'
  ) {
    const data = await this.emailVerifyOtpsRepository.findByEmail(to);

    if (data) {
      const cooldownEnd = new Date(data.createdAt.getTime() + 60 * 1000);

      if (cooldownEnd > new Date()) return;
    }

    const otp = generateOTP(6);
    await this.emailVerifyOtpsRepository.upsert(userId, to, otp);

    switch (purpose) {
      case 'email_verify':
        await this.emailService.sendRegisterOtpEmail(to, otp);
        break;
      case 'password_reset':
        await this.emailService.sendPasswordResetOtpEmail(to, otp);
        break;
      default: {
        throw new Error(`Unknown OTP purpose: ${purpose satisfies never}`);
      }
    }
  }

  async verifyOTP(email: Email, otp: string): Promise<{ userId: UUID }> {
    const data = await this.emailVerifyOtpsRepository.findByEmail(email);

    if (!data || data.expiresAt < new Date() || data.attempts >= env.MAX_OTP_ATTEMPTS) {
      throw new BadRequest400Error('OTP has expired or exceeded maximum attempts', 'OTP_INVALID');
    }

    if (data.code !== otp) {
      await this.emailVerifyOtpsRepository.incrementAttempts(data.userId);
      throw new BadRequest400Error('OTP validation failed', 'OTP_MISMATCH');
    }

    await this.emailVerifyOtpsRepository.deleteByUserId(data.userId);

    return { userId: data.userId };
  }
}

export const emailVerificationService = new EmailVerificationService(
  emailVerifyOtpsRepository,
  emailService
);
