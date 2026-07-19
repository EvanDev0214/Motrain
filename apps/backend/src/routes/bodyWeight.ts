import { Router } from 'express';
import { authMiddleware } from '@/middlewares/validate';
import { getUserBodyWeights } from '@/controllers/bodyWeight';

const bodyWeightsRouter = Router();

bodyWeightsRouter
  .route('/')
  .get(authMiddleware('ACCESS'), getUserBodyWeights);

export default bodyWeightsRouter;
