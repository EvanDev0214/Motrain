import type { Request, Response } from 'express';
import type { CreateUserWorkoutBody } from '@/schemas/workout';
import { workoutService } from '@/services/workout';

/**
 * @openapi
 * /api/workouts:
 *   get:
 *     tags:
 *       - Workouts
 *     summary: Get user workouts
 *     description: Retrieve all workouts belonging to the authenticated user, ordered by most recently created
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Workouts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/workouts/getWorkoutsSchema/response'
 *       401:
 *         description: "`INVALID_TOKEN` : Invalid or expired access token"
 */
export const getWorkouts = async (
  req: Request,
  res: Response
) => {
  const workouts = await workoutService.getWorkoutsByUserId(req.user!.userId);

  res.status(200).json({
    status: 'success',
    data: workouts
  });
};

/**
 * @openapi
 * /api/workouts:
 *   post:
 *     tags:
 *       - Workouts
 *     summary: Create a user workout
 *     description: Create a new workout record for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/workouts/createUserWorkoutSchema/request'
 *     responses:
 *       201:
 *         description: Workout created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/workouts/createUserWorkoutSchema/response'
 *       401:
 *         description: "`INVALID_TOKEN` : Invalid or expired access token"
 */
export const createUserWorkout = async (
  req: Request<unknown, unknown, CreateUserWorkoutBody>,
  res: Response
) => {
  const { user, body } = req;
  const workout = await workoutService.createUserWorkout(user!.userId, body);

  res.status(201).json({
    status: 'success',
    data: workout
  });
};
