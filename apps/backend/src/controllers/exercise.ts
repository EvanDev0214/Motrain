import type { Request, Response } from 'express';
import { exerciseService } from '@/services/exercise';

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
