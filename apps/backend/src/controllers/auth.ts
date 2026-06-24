import type { Request, Response } from 'express';
import env from '@/configs/env';
import { authService } from '@/services/auth';
import { emailVerificationService } from '@/services/emailVerification';
import { emailVerifyOtpsRepository } from '@/repositories/emailVerifyOtps';
import { userRepository } from '@/repositories/user';
import type { LoginRequest } from '@/schemas/auth';
import { BadRequest400Error } from '@/utils/error';

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     description: Create a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/auth/registerSchema/request'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/auth/registerSchema/response'
 *       409:
 *         description: "`EMAIL_EXISTS` : Email already exists"
 */
export const register = async (
  req: Request,
  res: Response
) => {
  const { nickname, email, password } = req.body;

  const newUser = await authService.register({
    nickname,
    email,
    password
  });

  await emailVerificationService.sendOTP(newUser.id, newUser.email);

  res.status(201).json({
    status: 'success',
    message: 'Verification email sent',
    data: {
      userId: newUser.id,
      email: newUser.email,
      createdAt: newUser.createdAt
    }
  });
};

/**
 * @openapi
 * /api/auth/email/verify:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verify email with OTP
 *     description: Verify user email address using the OTP code sent during registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/auth/verifyEmailOtpSchema/request'
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/auth/verifyEmailOtpSchema/response'
 *       400:
 *         description: |-
 *           `OTP_INVALID` : OTP has expired or exceeded maximum attempts
 *           `OTP_MISMATCH` : OTP validation failed
 */
export const verifyEmailOTP = async (
  req: Request,
  res: Response
) => {
  const { email, otp } = req.body;

  const data = await emailVerifyOtpsRepository.findByEmail(email);

  if (!data || data.expiresAt < new Date() || data.attempts >= env.MAX_OTP_ATTEMPTS) {
    throw new BadRequest400Error('OTP has expired or exceeded maximum attempts', 'OTP_INVALID');
  }

  if (data.code !== otp) {
    await emailVerifyOtpsRepository.incrementAttempts(data.userId);
    throw new BadRequest400Error('OTP validation failed', 'OTP_MISMATCH');
  }

  await userRepository.markEmailAsVerified(data.userId);
  await emailVerifyOtpsRepository.deleteByUserId(data.userId);

  res.status(200).json({
    status: 'success',
    message: 'Email verified successfully'
  });
};

/**
 * @openapi
 * /api/auth/email/otp:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Resend email verification OTP
 *     description: Resend a new OTP code to the user's email for verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/auth/resendEmailOtpSchema/request'
 *     responses:
 *       200:
 *         description: OTP resent (always returns success to prevent email enumeration)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/auth/resendEmailOtpSchema/response'
 */
export const resendEmailOTP = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body;

  const data = await userRepository.findByEmail(email);

  if (data && !data.emailVerifiedAt) {
    await emailVerificationService.sendOTP(data.id, email);
  }

  res.status(200).json({
    status: 'success',
    message: 'If this email is registered, a verification code has been sent'
  });
};

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login with email and password
 *     description: Authenticate user and return JWT access and refresh tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/auth/loginSchema/request'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/auth/loginSchema/response'
 *       401:
 *         description: "`INVALID_CREDENTIALS` : Invalid email or password"
 */
export const login = async (
  req: Request<unknown, unknown, LoginRequest>,
  res: Response
) => {
  const { email, password } = req.body;

  const { accessToken, refreshToken } = await authService.login(email, password);

  res.status(200).json({
    status: 'success',
    message: 'Login account successfully',
    data: {
      accessToken,
      refreshToken
    }
  });
};

/**
 * @openapi
 * /api/auth/token/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh access token
 *     description: Use a valid refresh token to obtain new access and refresh tokens
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/auth/refreshTokenSchema/response'
 *       401:
 *         description: "`INVALID_TOKEN` : Invalid or expired refresh token"
 */
export const refreshToken = async (
  req: Request,
  res: Response
) => {
  const token = req.headers.authorization!.split(' ')[1]!;
  const { newAccessToken, newRefreshToken } = await authService.refreshToken(token, req.user!);

  res.status(200).json({
    status: 'success',
    message: 'Token refreshed successfully',
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  });
};
