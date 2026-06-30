import { Router } from 'express';
import { authMiddleware, validateMiddleware } from '@/middlewares/validate';
import { getExercises, createUserExercise } from '@/controllers/exercise';
import { createUserExerciseSchema } from '@/schemas/exercise';

const exercisesRouter = Router();

exercisesRouter
  .route('/')
  .get(authMiddleware('ACCESS'), getExercises)
  .post(authMiddleware('ACCESS'), validateMiddleware(createUserExerciseSchema), createUserExercise);

export default exercisesRouter;
