import { Router } from 'express';
import { authMiddleware, validateMiddleware } from '@/middlewares/validate';
import {
  getExercises,
  createUserExercise,
  getExercise,
  replaceExercise,
  deleteExercise,
  getExerciseHistory
} from '@/controllers/exercise';
import {
  createUserExerciseSchema,
  getExerciseSchema,
  replaceExerciseSchema,
  deleteExerciseSchema,
  getExerciseHistorySchema
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

exercisesRouter
  .route('/:exerciseId/history')
  .get(authMiddleware('ACCESS'), validateMiddleware(getExerciseHistorySchema), getExerciseHistory);

export default exercisesRouter;
