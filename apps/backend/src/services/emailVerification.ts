import { emailService } from '@/services/email';
import { emailVerifyOtpsRepository, type EmailVerifyOtpsRepository } from '@/repositories/emailVerifyOtps';
import { generateOTP } from '@/utils/otp';

type EmailService = typeof emailService;

class EmailVerificationService {
  constructor(
    private emailVerifyOtpsRepository: EmailVerifyOtpsRepository,
    private emailService: EmailService
  ) {}

  async sendOTP(
    userId: UUID,
    to: Email
  ) {
    const otp = generateOTP(6);
    await this.emailVerifyOtpsRepository.upsert(userId, to, otp);
    await this.emailService.send(
      to,
      'Motrain - Email Verification Code',
      `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #333;">Verify Your Email</h2>
          <p>Your verification code is:</p>
          <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #111; margin: 24px 0;">${otp}</p>
          <p style="color: #666; font-size: 14px;">This code will expire in 5 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `
    );
  }
}

export const emailVerificationService = new EmailVerificationService(
  emailVerifyOtpsRepository,
  emailService
);
