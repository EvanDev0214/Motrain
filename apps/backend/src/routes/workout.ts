import { Router } from 'express';
import { authMiddleware, validateMiddleware } from '@/middlewares/validate';
import { createUserWorkoutSchema, getWorkoutSchema, createUserWorkoutExercisesSchema, replaceUserWorkoutSchema } from '@/schemas/workout';
import { getWorkouts, createUserWorkout, getWorkout, createUserWorkoutExercises, replaceUserWorkout } from '@/controllers/workout';

const workoutsRouter = Router();

workoutsRouter
  .route('/')
  .get(authMiddleware('ACCESS'), getWorkouts)
  .post(authMiddleware('ACCESS'), validateMiddleware(createUserWorkoutSchema), createUserWorkout);

workoutsRouter
  .route('/:workoutId')
  .get(authMiddleware('ACCESS'), validateMiddleware(getWorkoutSchema), getWorkout)
  .put(authMiddleware('ACCESS'), validateMiddleware(replaceUserWorkoutSchema), replaceUserWorkout);

workoutsRouter
  .route('/:workoutId/exercises')
  .post(authMiddleware('ACCESS'), validateMiddleware(createUserWorkoutExercisesSchema), createUserWorkoutExercises);

export default workoutsRouter;
