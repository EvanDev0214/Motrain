import { Router } from 'express';
import { authMiddleware, validateMiddleware } from '@/middlewares/validate';
import { createBodyWeightSchema, deleteBodyWeightSchema } from '@/schemas/bodyWeight';
import { getUserBodyWeights, createUserBodyWeight, deleteUserBodyWeight } from '@/controllers/bodyWeight';

const bodyWeightsRouter = Router();

bodyWeightsRouter.use(authMiddleware('ACCESS'));

bodyWeightsRouter
  .route('/')
  .get(getUserBodyWeights)
  .post(validateMiddleware(createBodyWeightSchema), createUserBodyWeight);

bodyWeightsRouter
  .route('/:bodyWeightId')
  .delete(validateMiddleware(deleteBodyWeightSchema), deleteUserBodyWeight);

export default bodyWeightsRouter;
