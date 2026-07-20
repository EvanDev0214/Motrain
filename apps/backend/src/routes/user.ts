import { Router } from 'express';
import { authMiddleware, validateMiddleware } from '@/middlewares/validate';
import { getMe, updateUserProfile } from '@/controllers/user';
import { updateUserProfileSchema } from '@/schemas/user';

const usersRouter = Router();

usersRouter
  .route('/me')
  .get(authMiddleware('ACCESS'), getMe)
  .patch(authMiddleware('ACCESS'), validateMiddleware(updateUserProfileSchema), updateUserProfile);

export default usersRouter;
