import env from '@/configs/env';
import { emailService, type EmailService } from '@/services/email';
import { emailVerifyOtpRepository, type EmailVerifyOtpRepo } from '@/repositories/emailVerifyOtp';
import { generateOTP } from '@/utils/otp';
import { BadRequest400Error, InternalServerError } from '@/utils/error';

type OtpPurpose = 'email_verify' | 'password_reset';

export class EmailVerificationService {
  constructor(
    private emailVerifyOtpRepository: EmailVerifyOtpRepo,
    private emailService: EmailService
  ) {}

  async sendOTP(
    userId: UUID,
    to: Email,
    purpose: OtpPurpose = 'email_verify'
  ) {
    const data = await this.emailVerifyOtpRepository.findByEmail(to);

    if (data) {
      const cooldownEnd = new Date(data.createdAt.getTime() + 60 * 1000);

      if (cooldownEnd > new Date()) return;
    }

    const otp = generateOTP(6);
    await this.emailVerifyOtpRepository.upsert({ userId, email: to, code: otp });

    switch (purpose) {
      case 'email_verify':
        await this.emailService.sendRegisterOtpEmail(to, otp);
        break;
      case 'password_reset':
        await this.emailService.sendPasswordResetOtpEmail(to, otp);
        break;
      default: {
        throw new InternalServerError(`Unknown OTP purpose: ${purpose satisfies never}`);
      }
    }
  }

  async verifyOTP(email: Email, otp: string): Promise<{ userId: UUID }> {
    const data = await this.emailVerifyOtpRepository.findByEmail(email);

    if (!data || data.expiresAt < new Date() || data.attempts >= env.MAX_OTP_ATTEMPTS) {
      throw new BadRequest400Error('OTP has expired or exceeded maximum attempts', 'OTP_INVALID');
    }

    if (data.code !== otp) {
      await this.emailVerifyOtpRepository.incrementAttempts(data.userId);
      throw new BadRequest400Error('OTP validation failed', 'OTP_MISMATCH');
    }

    await this.emailVerifyOtpRepository.deleteByUserId(data.userId);

    return { userId: data.userId };
  }
}

export const emailVerificationService = new EmailVerificationService(
  emailVerifyOtpRepository,
  emailService
);
