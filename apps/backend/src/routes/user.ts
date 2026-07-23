import { Router } from 'express';
import { authMiddleware, validateMiddleware } from '@/middlewares/validate';
import { getMe, updateUserProfile } from '@/controllers/user';
import { updateUserProfileSchema } from '@/schemas/user';

const usersRouter = Router();

usersRouter.use(authMiddleware('ACCESS'));

usersRouter
  .route('/me')
  .get(getMe)
  .patch(validateMiddleware(updateUserProfileSchema), updateUserProfile);

export default usersRouter;
