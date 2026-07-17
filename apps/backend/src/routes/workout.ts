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

workoutsRouter
  .route('/')
  .get(authMiddleware('ACCESS'), getWorkouts)
  .post(authMiddleware('ACCESS'), validateMiddleware(createUserWorkoutSchema), createUserWorkout);

workoutsRouter
  .route('/:workoutId')
  .get(authMiddleware('ACCESS'), validateMiddleware(getWorkoutSchema), getWorkout)
  .put(authMiddleware('ACCESS'), validateMiddleware(replaceUserWorkoutSchema), replaceUserWorkout)
  .delete(authMiddleware('ACCESS'), validateMiddleware(deleteUserWorkoutSchema), deleteUserWorkout);

workoutsRouter
  .route('/:workoutId/exercises')
  .post(authMiddleware('ACCESS'), validateMiddleware(createUserWorkoutExercisesSchema), createUserWorkoutExercises)
  .put(authMiddleware('ACCESS'), validateMiddleware(replaceUserWorkoutExercisesSchema), replaceUserWorkoutExercises);

export default workoutsRouter;
