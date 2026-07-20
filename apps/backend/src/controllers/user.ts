import type { Request, Response } from 'express';
import { userService } from '@/services/user';

export const getMe = async (
  req: Request,
  res: Response
) => {
  const user = await userService.getMe(req.user!.userId);

  res.status(200).json({
    status: 'success',
    data: user
  });
};
