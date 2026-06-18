import type { Request, Response } from 'express';
import { authService } from '@/services/auth';
import { emailVerificationService } from '@/services/emailVerification';

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
