import { Router } from 'express';
import { authMiddleware } from '@/middlewares/validate';
import { getMuscles } from '@/controllers/muscle';

const musclesRouter = Router();

musclesRouter
  .route('/')
  .get(authMiddleware('ACCESS'), getMuscles);

export default musclesRouter;
