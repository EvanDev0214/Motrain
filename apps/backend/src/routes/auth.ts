import { Router } from 'express';
import validateMiddleware from '@/middlewares/validate';
import { loginSchema, registerSchema, resendEmailOtpSchema, verifyEmailOtpSchema } from '@/schemas/auth';
import { register, resendEmailOTP, verifyEmailOTP, login } from '@/controllers/auth';

const authRouter = Router();

authRouter.post('/register', validateMiddleware(registerSchema), register);
authRouter.post('/email/verify', validateMiddleware(verifyEmailOtpSchema), verifyEmailOTP);
authRouter.post('/email/otp', validateMiddleware(resendEmailOtpSchema), resendEmailOTP);
authRouter.post('/login', validateMiddleware(loginSchema), login);

export default authRouter;
