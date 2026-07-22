import type { Request, Response } from 'express';
import { authService } from '@/services/auth';
import { emailVerificationService } from '@/services/emailVerification';
import { userRepository } from '@/repositories/user';
import type {
  RegisterBody,
  VerifyEmailOtpBody,
  ResendEmailOtpBody,
  LoginBody,
  UpdatePasswordBody,
  ForgotPasswordBody,
  VerifyPasswordOtpBody,
  ResetPasswordBody
} from '@/schemas/auth';
import { sendSuccess } from '@/utils/response';

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
  req: Request<unknown, unknown, RegisterBody>,
  res: Response
) => {
  const newUser = await authService.register(req.body);

  await emailVerificationService.sendOTP(newUser.id, newUser.email);

  return sendSuccess(res, 201, {
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
  req: Request<unknown, unknown, VerifyEmailOtpBody>,
  res: Response
) => {
  await authService.verifyEmailOTP(req.body);

  return sendSuccess(res, 200, {
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
  req: Request<unknown, unknown, ResendEmailOtpBody>,
  res: Response
) => {
  const data = await userRepository.findByEmail(req.body.email);

  if (data && !data.emailVerifiedAt) {
    await emailVerificationService.sendOTP(data.id, data.email);
  }

  return sendSuccess(res, 200, {
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
  req: Request<unknown, unknown, LoginBody>,
  res: Response
) => {
  const { accessToken, refreshToken } = await authService.login(req.body);

  return sendSuccess(res, 200, {
    message: 'Login account successfully',
    data: {
      accessToken,
      refreshToken
    }
  });
};

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout and revoke refresh token
 *     description: Invalidate the user's refresh token to log them out. The client should also discard the access token locally.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/auth/logoutSchema/response'
 *       401:
 *         description: "`INVALID_TOKEN` : Invalid or expired refresh token"
 */
export const logout = async (
  req: Request,
  res: Response
) => {
  const token = req.headers.authorization!.split(' ')[1]!;
  await authService.logout(token, req.user!.userId);

  return sendSuccess(res, 200, {
    message: 'Logged out successfully'
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

  return sendSuccess(res, 200, {
    message: 'Token refreshed successfully',
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  });
};

/**
 * @openapi
 * /api/auth/password:
 *   patch:
 *     tags:
 *       - Auth
 *     summary: Update password
 *     description: Change the authenticated user's password by verifying the old password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/auth/updatePasswordSchema/request'
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/auth/updatePasswordSchema/response'
 *       400:
 *         description: "`INVALID_PASSWORD` : Old password is incorrect"
 *       401:
 *         description: "`INVALID_TOKEN` : Invalid or expired access token"
 */
export const updatePassword = async (
  req: Request<unknown, unknown, UpdatePasswordBody>,
  res: Response
) => {
  const { oldPassword, newPassword } = req.body;
  await authService.updatePassword(
    req.user!.userId,
    oldPassword,
    newPassword
  );

  return sendSuccess(res, 200, {
    message: 'Password updated successfully'
  });
};

/**
 * @openapi
 * /api/auth/password/forgot:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Request a password reset code
 *     description: Send a password reset OTP to the user's email. Always returns success to prevent email enumeration.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/auth/forgotPasswordSchema/request'
 *     responses:
 *       200:
 *         description: Password reset code sent (always returns success to prevent email enumeration)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/auth/forgotPasswordSchema/response'
 */
export const forgotPassword = async (
  req: Request<unknown, unknown, ForgotPasswordBody>,
  res: Response
) => {
  await authService.forgotPassword(req.body.email);

  return sendSuccess(res, 200, {
    message: 'If this email is registered, a password reset code has been sent'
  });
};

/**
 * @openapi
 * /api/auth/password/verify:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verify password reset OTP
 *     description: Verify the OTP sent for password reset and return a short-lived reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/auth/verifyPasswordOtpSchema/request'
 *     responses:
 *       200:
 *         description: OTP verified, reset token issued
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/auth/verifyPasswordOtpSchema/response'
 *       400:
 *         description: |
 *           - `OTP_INVALID` : OTP has expired or exceeded maximum attempts
 *           - `OTP_MISMATCH` : OTP validation failed
 */
export const verifyPasswordOTP = async (
  req: Request<unknown, unknown, VerifyPasswordOtpBody>,
  res: Response
) => {
  const { email, otp } = req.body;
  const { resetToken } = await authService.verifyPasswordOTP(email, otp);

  return sendSuccess(res, 200, {
    message: 'OTP verified successfully',
    data: {
      resetToken
    }
  });
};

/**
 * @openapi
 * /api/auth/password/reset:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reset password
 *     description: Reset the user's password using a short-lived reset token obtained from OTP verification. Revokes all refresh tokens to force re-login on all devices.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/auth/resetPasswordSchema/request'
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/auth/resetPasswordSchema/response'
 *       401:
 *         description: "`INVALID_TOKEN` : Invalid or expired reset token"
 */
export const resetPassword = async (
  req: Request<unknown, unknown, ResetPasswordBody>,
  res: Response
) => {
  const { user, body } = req;
  await authService.resetPassword(user!.userId, body.newPassword);

  return sendSuccess(res, 200, {
    message: 'Password reset successfully'
  });
};
