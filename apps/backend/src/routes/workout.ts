import { Router } from 'express';
import { authMiddleware, validateMiddleware } from '@/middlewares/validate';
import { createUserWorkoutSchema, getWorkoutSchema } from '@/schemas/workout';
import { getWorkouts, createUserWorkout, getWorkout } from '@/controllers/workout';

const workoutsRouter = Router();

workoutsRouter
  .route('/')
  .get(authMiddleware('ACCESS'), getWorkouts)
  .post(authMiddleware('ACCESS'), validateMiddleware(createUserWorkoutSchema), createUserWorkout);

workoutsRouter
  .route('/:workoutId')
  .get(authMiddleware('ACCESS'), validateMiddleware(getWorkoutSchema), getWorkout);

export default workoutsRouter;
