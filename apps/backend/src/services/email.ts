import { Resend } from 'resend';
import env from '@/configs/env';
import { logger } from '@/utils/logger';

class ResendService {
  constructor(
    private resend: Resend
  ) {}

  async send(
    to: Email,
    subject: string,
    html: string
  ) {
    const { error } = await this.resend.emails.send({
      from: env.RESEND_FROM,
      to,
      subject,
      html
    });

    if (error) {
      logger.error({
        service: 'resend',
        cause: error
      }, 'Failed to send email');
    }
  }
}

const resendService = new ResendService(new Resend(env.RESEND_API_KEY));

export class EmailService {
  constructor(
    private resendService:  ResendService,
    private OTP_EXPIRES_MINUTES: number
  ) {}
  async sendRegisterOtpEmail(to: Email, otp: string) {
    await this.resendService.send(
      to,
      'Motrain - Email Verification Code',
      `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #333;">Verify Your Email</h2>
        <p>Your verification code is:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #111; margin: 24px 0;">${otp}</p>
        <p style="color: #666; font-size: 14px;">This code will expire in ${this.OTP_EXPIRES_MINUTES} minutes. If you did not request this, please ignore this email.</p>
      </div>
    `);
  }

  async sendPasswordResetOtpEmail(to: Email, otp: string) {
    await this.resendService.send(
      to,
      'Motrain - Password Reset Code',
      `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>Your password reset code is:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #111; margin: 24px 0;">${otp}</p>
        <p style="color: #666; font-size: 14px;">This code will expire in ${this.OTP_EXPIRES_MINUTES} minutes. If you did not request this, please ignore this email.</p>
      </div>
    `);
  }

  async sendPasswordResetConfirmationEmail(to: Email) {
    await this.resendService.send(
      to,
      'Motrain - Password Reset Successful',
      `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #333;">Password Reset Successful</h2>
        <p>Your password has been successfully reset.</p>
        <p style="color: #666; font-size: 14px;">If you did not make this change, please contact support immediately or reset your password again to secure your account.</p>
      </div>
    `);
  }
}

export const emailService = new EmailService(
  resendService,
  env.RESEND_OTP_EXPIRES_MINUTES
);
