import { Router } from 'express';
import validateMiddleware from '@/middlewares/validate';
import { registerSchema } from '@/schemas/auth';
import { register } from '@/controllers/auth';

const authRouter = Router();

authRouter.post('/register', validateMiddleware(registerSchema), register);

export default authRouter;
