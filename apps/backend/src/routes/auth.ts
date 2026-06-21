import { Router } from 'express';
import validateMiddleware from '@/middlewares/validate';
import { registerSchema, verifyEmailOtpSchema } from '@/schemas/auth';
import { register, verifyEmailOTP } from '@/controllers/auth';

const authRouter = Router();

authRouter.post('/register', validateMiddleware(registerSchema), register);
authRouter.post('/email/verify', validateMiddleware(verifyEmailOtpSchema), verifyEmailOTP);

export default authRouter;
