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

exercisesRouter.use(authMiddleware('ACCESS'));

exercisesRouter
  .route('/')
  .get(getExercises)
  .post(validateMiddleware(createUserExerciseSchema), createUserExercise);

exercisesRouter
  .route('/:exerciseId')
  .get(validateMiddleware(getExerciseSchema), getExercise)
  .put(validateMiddleware(replaceExerciseSchema), replaceExercise)
  .delete(validateMiddleware(deleteExerciseSchema), deleteExercise);

exercisesRouter
  .route('/:exerciseId/history')
  .get(validateMiddleware(getExerciseHistorySchema), getExerciseHistory);

export default exercisesRouter;
