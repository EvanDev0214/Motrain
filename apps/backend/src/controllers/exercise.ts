import type { Request, Response } from 'express';
import { exerciseService } from '@/services/exercise';
import type {
  CreateUserExerciseBody,
  GetExerciseParams,
  ReplaceExerciseBody,
  ReplaceExerciseParams,
  DeleteExerciseParams,
  GetExerciseHistoryParams
} from '@/schemas/exercise';

/**
 * @openapi
 * /api/exercises:
 *   get:
 *     tags:
 *       - Exercises
 *     summary: Get available exercises
 *     description: Retrieve all exercises available to the authenticated user, including system exercises and user-created exercises
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Exercises retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/exercises/getExercisesSchema/response'
 *       401:
 *         description: "`INVALID_TOKEN` : Invalid or expired access token"
 */
export const getExercises = async (
  req: Request,
  res: Response
) => {
  const { user } = req;
  const exercises = await exerciseService.getExercises(user!.userId);

  res.status(200).json({
    status: 'success',
    data: exercises
  });
};

/**
 * @openapi
 * /api/exercises:
 *   post:
 *     tags:
 *       - Exercises
 *     summary: Create a user exercise
 *     description: Create a custom exercise for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/exercises/createUserExerciseSchema/request'
 *     responses:
 *       201:
 *         description: Exercise created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/exercises/createUserExerciseSchema/response'
 *       401:
 *         description: "`INVALID_TOKEN` : Invalid or expired access token"
 *       404:
 *         description: "`MUSCLE_NOT_FOUND` : One or more muscles do not exist"
 */
export const createUserExercise = async (
  req: Request<unknown, unknown, CreateUserExerciseBody>,
  res: Response
) => {
  const { body, user } = req;
  const exercise = await exerciseService.createUserExercise(user!.userId, body);

  res.status(201).json({
    status: 'success',
    data: exercise
  });
};

/**
 * @openapi
 * /api/exercises/{exerciseId}:
 *   get:
 *     tags:
 *       - Exercises
 *     summary: Get exercise by ID
 *     description: Retrieve a specific exercise by its ID. Users can access system exercises and their own custom exercises.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: exerciseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The exercise UUID
 *     responses:
 *       200:
 *         description: Exercise retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/exercises/getExerciseSchema/response'
 *       401:
 *         description: "`INVALID_TOKEN` : Invalid or expired access token"
 *       404:
 *         description: "`EXERCISE_NOT_FOUND` : The exercise does not exist or has been deleted"
 */
export const getExercise = async (
  req: Request<GetExerciseParams>,
  res: Response
) => {
  const { exerciseId } = req.params;
  const { userId } = req.user!;
  const exercise = await exerciseService.getExerciseById(userId, exerciseId);

  res.status(200).json({
    status: 'success',
    data: exercise
  });
};

/**
 * @openapi
 * /api/exercises/{exerciseId}:
 *   put:
 *     tags:
 *       - Exercises
 *     summary: Replace a user exercise
 *     description: Replace all fields of a user-created exercise. System exercises cannot be modified.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: exerciseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The exercise UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/exercises/replaceExerciseSchema/request'
 *     responses:
 *       200:
 *         description: Exercise replaced successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/exercises/replaceExerciseSchema/response'
 *       401:
 *         description: "`INVALID_TOKEN` : Invalid or expired access token"
 *       403:
 *         description: "`EXERCISE_SYSTEM_IMMUTABLE` : System exercises cannot be modified"
 *       404:
 *         description: |
 *                    - `EXERCISE_NOT_FOUND` : The exercise does not exist or has been deleted
 *                    - `MUSCLE_NOT_FOUND` : One or more muscles do not exist
 */
export const replaceExercise = async (
  req: Request<ReplaceExerciseParams, unknown, ReplaceExerciseBody>,
  res: Response
) => {
  const { user, params, body } = req;
  const exercise = await exerciseService.replaceExerciseById(user!.userId, params.exerciseId, body);

  res.status(200).json({
    status: 'success',
    data: exercise
  });
};

/**
 * @openapi
 * /api/exercises/{exerciseId}:
 *   delete:
 *     tags:
 *       - Exercises
 *     summary: Delete a user exercise
 *     description: Delete a user-created exercise. System exercises cannot be deleted.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: exerciseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The exercise UUID
 *     responses:
 *       204:
 *         description: Exercise deleted successfully
 *       401:
 *         description: "`INVALID_TOKEN` : Invalid or expired access token"
 *       403:
 *         description: "`EXERCISE_SYSTEM_IMMUTABLE` : System exercises cannot be modified"
 *       404:
 *         description: "`EXERCISE_NOT_FOUND` : The exercise does not exist or has been deleted"
 */
export const deleteExercise = async (
  req: Request<DeleteExerciseParams>,
  res: Response
) => {
  const { user, params } = req;
  await exerciseService.deleteExerciseById(user!.userId, params.exerciseId);

  res.status(204).send();
};

/**
 * @openapi
 * /api/exercises/{exerciseId}/history:
 *   get:
 *     tags:
 *       - Exercises
 *     summary: Get exercise history
 *     description: Retrieve the authenticated user's past workout sets for a specific exercise, grouped by workout
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: exerciseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The exercise UUID
 *     responses:
 *       200:
 *         description: Exercise history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/exercises/getExerciseHistorySchema/response'
 *       401:
 *         description: "`INVALID_TOKEN` : Invalid or expired access token"
 *       404:
 *         description: "`EXERCISE_NOT_FOUND` : The exercise does not exist or has been deleted"
 */
export const getExerciseHistory = async (
  req: Request<GetExerciseHistoryParams>,
  res: Response
) => {
  const { user, params } = req;
  const exerciseHistory = await exerciseService.getExerciseHistory(user!.userId, params.exerciseId);

  res.status(200).json({
    status: 'success',
    data: exerciseHistory
  });
};
