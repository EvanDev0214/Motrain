import type { Request, Response } from 'express';
import { userService } from '@/services/user';
import type { UpdateUserProfileBody } from '@/schemas/user';
import { sendSuccess } from '@/utils/response';

export const getMe = async (
  req: Request,
  res: Response
) => {
  const user = await userService.getMe(req.user!.userId);

  return sendSuccess(res, 200, {
    data: user
  });
};

export const updateUserProfile = async (
  req: Request<unknown, unknown, UpdateUserProfileBody>,
  res: Response
) => {
  const { user, body } = req;
  const updated = await userService.updateUserProfile(user!.userId, body);

  return sendSuccess(res, 200, {
    data: updated
  });
};

