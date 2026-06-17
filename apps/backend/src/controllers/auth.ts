import type { Request, Response } from 'express';
import { authService } from '@/services/auth';

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

  res.status(201).json({
    status: 'success',
    data: {
      id: newUser.id,
      email: newUser.email,
      createdAt: newUser.createdAt
    }
  });
};
