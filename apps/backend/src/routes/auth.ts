import { Router } from 'express';
import { validateMiddleware, authMiddleware } from '@/middlewares/validate';
import { loginSchema, registerSchema, resendEmailOtpSchema, verifyEmailOtpSchema } from '@/schemas/auth';
import { register, resendEmailOTP, verifyEmailOTP, login, refreshToken } from '@/controllers/auth';

const authRouter = Router();

authRouter.post('/register', validateMiddleware(registerSchema), register);
authRouter.post('/email/verify', validateMiddleware(verifyEmailOtpSchema), verifyEmailOTP);
authRouter.post('/email/otp', validateMiddleware(resendEmailOtpSchema), resendEmailOTP);
authRouter.post('/login', validateMiddleware(loginSchema), login);
authRouter.post('/token/refresh', authMiddleware('REFRESH'), refreshToken);

export default authRouter;
