import { Router } from 'express';
import validateMiddleware from '@/middlewares/validate';
import { registerSchema, resendEmailOtpSchema, verifyEmailOtpSchema } from '@/schemas/auth';
import { register, resendEmailOTP, verifyEmailOTP } from '@/controllers/auth';

const authRouter = Router();

authRouter.post('/register', validateMiddleware(registerSchema), register);
authRouter.post('/email/verify', validateMiddleware(verifyEmailOtpSchema), verifyEmailOTP);
authRouter.post('/email/otp', validateMiddleware(resendEmailOtpSchema), resendEmailOTP);

export default authRouter;
