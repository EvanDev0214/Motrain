import type { Request, Response } from 'express';
import { muscleService } from '@/services/muscle';

/**
 * @openapi
 * /api/muscles:
 *   get:
 *     tags:
 *       - Muscles
 *     summary: Get all muscles
 *     description: Retrieve all available muscle groups
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Muscles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/muscles/getMusclesSchema/response'
 *       401:
 *         description: "`INVALID_TOKEN` : Invalid or expired access token"
 */
export const getMuscles = async (
  _req: Request,
  res: Response
) => {
  const muscles = await muscleService.getMuscles();

  res.status(200).json({
    status: 'success',
    data: muscles
  });
};
