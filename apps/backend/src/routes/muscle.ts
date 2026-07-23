import { Router } from 'express';
import { authMiddleware } from '@/middlewares/validate';
import { getMuscles } from '@/controllers/muscle';

const musclesRouter = Router();

musclesRouter.use(authMiddleware('ACCESS'));

musclesRouter
  .route('/')
  .get(getMuscles);

export default musclesRouter;
