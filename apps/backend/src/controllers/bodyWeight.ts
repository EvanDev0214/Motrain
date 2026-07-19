import type { Request, Response } from 'express';
import { bodyWeightService } from '@/services/bodyWeight';
import type { CreateBodyWeightBody } from '@/schemas/bodyWeight';

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

/**
 * @openapi
 * /api/body-weights:
 *   post:
 *     tags:
 *       - BodyWeights
 *     summary: Create or update a user body weight
 *     description: Create a new body weight record for the authenticated user, or update the existing record if one already exists for the same recorded date
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/bodyWeights/createUserBodyWeightSchema/request'
 *     responses:
 *       201:
 *         description: Body weight created or updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/bodyWeights/createUserBodyWeightSchema/response'
 *       401:
 *         description: "`INVALID_TOKEN` : Invalid or expired access token"
 */
export const createUserBodyWeight = async (
  req: Request<unknown, unknown, CreateBodyWeightBody>,
  res: Response
) => {
  const { user, body } = req;
  const upsertedBodyWeight = await bodyWeightService.createUserBodyWeight(user!.userId, body);

  res.status(201).json({
    status: 'success',
    data: upsertedBodyWeight
  });
};
