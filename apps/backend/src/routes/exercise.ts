import { Router } from 'express';
import { authMiddleware, validateMiddleware } from '@/middlewares/validate';
import {
  getExercises,
  createUserExercise,
  getExercise,
  replaceExercise,
  deleteExercise
} from '@/controllers/exercise';
import {
  createUserExerciseSchema,
  getExerciseSchema,
  replaceExerciseSchema,
  deleteExerciseSchema
} from '@/schemas/exercise';

const exercisesRouter = Router();

exercisesRouter
  .route('/')
  .get(authMiddleware('ACCESS'), getExercises)
  .post(authMiddleware('ACCESS'), validateMiddleware(createUserExerciseSchema), createUserExercise);

exercisesRouter
  .route('/:exerciseId')
  .get(authMiddleware('ACCESS'), validateMiddleware(getExerciseSchema), getExercise)
  .put(authMiddleware('ACCESS'), validateMiddleware(replaceExerciseSchema), replaceExercise)
  .delete(authMiddleware('ACCESS'), validateMiddleware(deleteExerciseSchema), deleteExercise);

export default exercisesRouter;
