import { Router } from 'express';
import { authMiddleware } from '@/middlewares/validate';
import { getMe } from '@/controllers/user';

const usersRouter = Router();

usersRouter
  .route('/me')
  .get(authMiddleware('ACCESS'), getMe);

export default usersRouter;
