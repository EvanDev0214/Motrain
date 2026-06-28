import { Router } from 'express';
import { validateMiddleware, authMiddleware } from '@/middlewares/validate';
import { loginSchema, registerSchema, resendEmailOtpSchema, verifyEmailOtpSchema, updatePasswordSchema, forgotPasswordSchema, verifyPasswordOtpSchema, resetPasswordSchema } from '@/schemas/auth';
import { register, resendEmailOTP, verifyEmailOTP, login, logout, refreshToken, updatePassword, forgotPassword, verifyPasswordOTP, resetPassword } from '@/controllers/auth';

const authRouter = Router();

authRouter.post('/register', validateMiddleware(registerSchema), register);
authRouter.post('/email/verify', validateMiddleware(verifyEmailOtpSchema), verifyEmailOTP);
authRouter.post('/email/otp', validateMiddleware(resendEmailOtpSchema), resendEmailOTP);
authRouter.post('/login', validateMiddleware(loginSchema), login);
authRouter.post('/logout', authMiddleware('REFRESH'), logout);
authRouter.post('/token/refresh', authMiddleware('REFRESH'), refreshToken);
authRouter.patch('/password', authMiddleware('ACCESS'), validateMiddleware(updatePasswordSchema), updatePassword);
authRouter.post('/password/forgot', validateMiddleware(forgotPasswordSchema), forgotPassword);
authRouter.post('/password/verify', validateMiddleware(verifyPasswordOtpSchema), verifyPasswordOTP);
authRouter.post('/password/reset', authMiddleware('PASSWORD_RESET'), validateMiddleware(resetPasswordSchema), resetPassword);

export default authRouter;
