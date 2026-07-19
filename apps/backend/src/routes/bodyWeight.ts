import { Router } from 'express';
import { authMiddleware, validateMiddleware } from '@/middlewares/validate';
import { createBodyWeightSchema, deleteBodyWeightSchema } from '@/schemas/bodyWeight';
import { getUserBodyWeights, createUserBodyWeight, deleteUserBodyWeight } from '@/controllers/bodyWeight';

const bodyWeightsRouter = Router();

bodyWeightsRouter
  .route('/')
  .get(authMiddleware('ACCESS'), getUserBodyWeights)
  .post(authMiddleware('ACCESS'), validateMiddleware(createBodyWeightSchema), createUserBodyWeight);

bodyWeightsRouter
  .route('/:bodyWeightId')
  .delete(authMiddleware('ACCESS'), validateMiddleware(deleteBodyWeightSchema), deleteUserBodyWeight);

export default bodyWeightsRouter;
