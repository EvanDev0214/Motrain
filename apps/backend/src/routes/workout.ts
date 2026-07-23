import { Router } from 'express';
import { authMiddleware, validateMiddleware } from '@/middlewares/validate';
import {
  createUserWorkoutSchema,
  getWorkoutSchema,
  createUserWorkoutExercisesSchema,
  replaceUserWorkoutSchema,
  deleteUserWorkoutSchema,
  replaceUserWorkoutExercisesSchema
} from '@/schemas/workout';
import {
  getWorkouts,
  createUserWorkout,
  getWorkout,
  createUserWorkoutExercises,
  replaceUserWorkout,
  deleteUserWorkout,
  replaceUserWorkoutExercises
} from '@/controllers/workout';

const workoutsRouter = Router();

workoutsRouter.use(authMiddleware('ACCESS'));

workoutsRouter
  .route('/')
  .get(getWorkouts)
  .post(validateMiddleware(createUserWorkoutSchema), createUserWorkout);

workoutsRouter
  .route('/:workoutId')
  .get(validateMiddleware(getWorkoutSchema), getWorkout)
  .put(validateMiddleware(replaceUserWorkoutSchema), replaceUserWorkout)
  .delete(validateMiddleware(deleteUserWorkoutSchema), deleteUserWorkout);

workoutsRouter
  .route('/:workoutId/exercises')
  .post(validateMiddleware(createUserWorkoutExercisesSchema), createUserWorkoutExercises)
  .put(validateMiddleware(replaceUserWorkoutExercisesSchema), replaceUserWorkoutExercises);

export default workoutsRouter;
