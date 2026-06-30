import { Router } from 'express';
import { authMiddleware } from '@/middlewares/validate';
import { getExercises } from '@/controllers/exercise';

const exercisesRouter = Router();

exercisesRouter
  .route('/')
  .get(authMiddleware('ACCESS'), getExercises);

export default exercisesRouter;
