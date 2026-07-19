import type { Request, Response } from 'express';
import { bodyWeightService } from '@/services/bodyWeight';

/**
 * @openapi
 * /api/body-weights:
 *   get:
 *     tags:
 *       - BodyWeights
 *     summary: Get user body weights
 *     description: Retrieve all body weight records for the authenticated user, ordered by recorded date descending
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Body weights retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/bodyWeights/getUserBodyWeightsSchema/response'
 *       401:
 *         description: "`INVALID_TOKEN` : Invalid or expired access token"
 */
export const getUserBodyWeights = async (
  req: Request,
  res: Response
) => {
  const bodyWeightRecords = await bodyWeightService.getUserBodyWeights(req.user!.userId);

  res.status(200).json({
    status: 'success',
    data: bodyWeightRecords
  });
};
