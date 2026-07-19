import { Router } from 'express';
import { authMiddleware, validateMiddleware } from '@/middlewares/validate';
import { createBodyWeightSchema } from '@/schemas/bodyWeight';
import { getUserBodyWeights, createUserBodyWeight } from '@/controllers/bodyWeight';

const bodyWeightsRouter = Router();

bodyWeightsRouter
  .route('/')
  .get(authMiddleware('ACCESS'), getUserBodyWeights)
  .post(authMiddleware('ACCESS'), validateMiddleware(createBodyWeightSchema), createUserBodyWeight);

export default bodyWeightsRouter;
