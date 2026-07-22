import type { Request, Response } from 'express';
import type {
  CreateUserWorkoutBody,
  CreateUserWorkoutExercisesBody,
  CreateUserWorkoutExercisesParams,
  DeleteUserWorkoutParams,
  GetWorkoutParams,
  ReplaceUserWorkoutBody,
  ReplaceUserWorkoutExercisesBody,
  ReplaceUserWorkoutExercisesParams,
  ReplaceUserWorkoutParams
} from '@/schemas/workout';
import { workoutService } from '@/services/workout';
import { sendSuccess, sendNoContent } from '@/utils/response';

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

  return sendSuccess(res, 200, {
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

  return sendSuccess(res, 201, {
    data: workout
  });
};

/**
 * @openapi
 * /api/workouts/{workoutId}:
 *   get:
 *     tags:
 *       - Workouts
 *     summary: Get workout by ID
 *     description: Retrieve a specific workout belonging to the authenticated user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The workout UUID
 *     responses:
 *       200:
 *         description: Workout retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/workouts/getWorkoutSchema/response'
 *       401:
 *         description: "`INVALID_TOKEN` : Invalid or expired access token"
 *       404:
 *         description: "`WORKOUT_NOT_FOUND` : The workout does not exist or has been deleted"
 */
export const getWorkout = async (
  req: Request<GetWorkoutParams>,
  res: Response
) => {
  const { user, params } = req;
  const workout = await workoutService.getWorkoutDetails(user!.userId, params.workoutId);

  return sendSuccess(res, 200, {
    data: workout
  });
};

/**
 * @openapi
 * /api/workouts/{workoutId}/exercises:
 *   post:
 *     tags:
 *       - Workouts
 *     summary: Add exercises to a workout
 *     description: Create workout exercises (with their sets) for a workout belonging to the authenticated user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The workout UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/workouts/createUserWorkoutExercisesSchema/request'
 *     responses:
 *       201:
 *         description: Workout exercises created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/workouts/createUserWorkoutExercisesSchema/response'
 *       401:
 *         description: "`INVALID_TOKEN` : Invalid or expired access token"
 *       404:
 *         description: "`WORKOUT_NOT_FOUND` : The workout does not exist or has been deleted\n\n`EXERCISE_NOT_FOUND` : One or more exercises do not exist or have been deleted"
 */
export const createUserWorkoutExercises = async (
  req: Request<CreateUserWorkoutExercisesParams, unknown, CreateUserWorkoutExercisesBody>,
  res: Response
) => {
  const { user, params, body } = req;
  const workout = await workoutService.createUserWorkoutExercises(user!.userId, params.workoutId, body);

  return sendSuccess(res, 201, {
    data: workout
  });
};

/**
 * @openapi
 * /api/workouts/{workoutId}/exercises:
 *   put:
 *     tags:
 *       - Workouts
 *     summary: Replace exercises in a workout
 *     description: Replace all workout exercises (with their sets) for a workout belonging to the authenticated user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The workout UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/workouts/replaceUserWorkoutExercisesSchema/request'
 *     responses:
 *       200:
 *         description: Workout exercises replaced successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/workouts/replaceUserWorkoutExercisesSchema/response'
 *       401:
 *         description: "`INVALID_TOKEN` : Invalid or expired access token"
 *       404:
 *         description: "`WORKOUT_NOT_FOUND` : The workout does not exist or has been deleted\n\n`EXERCISE_NOT_FOUND` : One or more exercises do not exist or have been deleted"
 */
export const replaceUserWorkoutExercises = async (
  req: Request<ReplaceUserWorkoutExercisesParams, unknown, ReplaceUserWorkoutExercisesBody>,
  res: Response
) => {
  const { user, params, body } = req;
  const updatedWorkout = await workoutService.replaceUserWorkoutExercises(user!.userId, params.workoutId, body);

  return sendSuccess(res, 200, {
    data: updatedWorkout
  });
};

/**
 * @openapi
 * /api/workouts/{workoutId}:
 *   put:
 *     tags:
 *       - Workouts
 *     summary: Replace a user workout
 *     description: Replace the name and reflections of a workout belonging to the authenticated user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The workout UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/workouts/createUserWorkoutSchema/request'
 *     responses:
 *       200:
 *         description: Workout replaced successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/workouts/createUserWorkoutSchema/response'
 *       401:
 *         description: "`INVALID_TOKEN` : Invalid or expired access token"
 *       404:
 *         description: "`WORKOUT_NOT_FOUND` : The workout does not exist or has been deleted"
 */
export const replaceUserWorkout = async (
  req: Request<ReplaceUserWorkoutParams, unknown, ReplaceUserWorkoutBody>,
  res: Response
) => {
  const { user, params, body } = req;
  const updatedWorkout = await workoutService.replaceUserWorkout(user!.userId, params.workoutId, body);

  return sendSuccess(res, 200, {
    data: updatedWorkout
  });
};

/**
 * @openapi
 * /api/workouts/{workoutId}:
 *   delete:
 *     tags:
 *       - Workouts
 *     summary: Delete a user workout
 *     description: Delete a workout belonging to the authenticated user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The workout UUID
 *     responses:
 *       204:
 *         description: Workout deleted successfully
 *       401:
 *         description: "`INVALID_TOKEN` : Invalid or expired access token"
 *       404:
 *         description: "`WORKOUT_NOT_FOUND` : The workout does not exist or has been deleted"
 */
export const deleteUserWorkout = async (
  req: Request<DeleteUserWorkoutParams>,
  res: Response
) => {
  const { user, params } = req;
  await workoutService.deleteUserWorkout(user!.userId, params.workoutId);

  return sendNoContent(res);
};
