import type { Request, Response } from 'express';
import { authService } from '@/services/auth';
import { emailVerificationService } from '@/services/emailVerification';
import { emailVerifyOtpsRepository } from '@/repositories/emailVerifyOtps';
import { userRepository } from '@/repositories/user';
import { BadRequest400Error } from '@/utils/error';

export const register = async (
  req: Request,
  res: Response
) => {
  const { nickname, email, password } = req.body;

  const newUser = await authService.register({
    nickname,
    email,
    password
  });

  await emailVerificationService.sendOTP(newUser.id, newUser.email);

  res.status(201).json({
    status: 'success',
    message: 'Verification email sent',
    data: {
      userId: newUser.id,
      email: newUser.email,
      createdAt: newUser.createdAt
    }
  });
};

export const verifyEmailOTP = async (
  req: Request,
  res: Response
) => {
  const { email, otp } = req.body;

  const data = await emailVerifyOtpsRepository.findByEmail(email);

  if (!data || data.expiresAt < new Date() || data.attempts >= Number(process.env.MAX_OTP_ATTEMPTS)) {
    throw new BadRequest400Error('OTP has expired or exceeded maximum attempts', 'OTP_INVALID');
  }

  if (data.code !== otp) {
    await emailVerifyOtpsRepository.incrementAttempts(data.userId);
    throw new BadRequest400Error('OTP validation failed', 'OTP_MISMATCH');
  }

  await userRepository.markEmailAsVerified(data.userId);
  await emailVerifyOtpsRepository.deleteByUserId(data.userId);

  res.status(200).json({
    status: 'success',
    message: 'Email verified successfully'
  });
};

export const resendEmailOTP = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body;

  const data = await userRepository.findByEmail(email);

  if (data && !data.emailVerifiedAt) {
    await emailVerificationService.sendOTP(data.id, email);
  }

  res.status(200).json({
    status: 'success',
    message: 'If this email is registered, a verification code has been sent'
  });
};
