import type { Request, Response } from 'express';
import { exerciseService } from '@/services/exercise';
import type { CreateUserExerciseRequest } from '@/schemas/exercise';

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
  const exercises = await exerciseService.getExercises(req.user!.userId);

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
 */
export const createUserExercise = async (
  req: Request<unknown, unknown, CreateUserExerciseRequest>,
  res: Response
) => {
  const { body, user } = req;
  const exercise = await exerciseService.createUserExercise(user!.userId, body);

  res.status(201).json({
    status: 'success',
    data: exercise
  });
};
