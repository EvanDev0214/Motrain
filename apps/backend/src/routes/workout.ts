import { Router } from 'express';
import { authMiddleware, validateMiddleware } from '@/middlewares/validate';
import { createUserWorkoutSchema } from '@/schemas/workout';
import { createUserWorkout } from '@/controllers/workout';

const workoutsRouter = Router();

workoutsRouter
  .route('/')
  .post(authMiddleware('ACCESS'), validateMiddleware(createUserWorkoutSchema), createUserWorkout);

export default workoutsRouter;
