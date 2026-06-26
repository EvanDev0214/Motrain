import z from 'zod';

const ALPHANUMERIC_ONLY = {
  pattern: /^[a-zA-Z0-9]+$/,
  message: '密碼只能包含英文字母及數字'
};

const NO_SPECIAL_CHARS = {
  pattern: /^[a-zA-Z0-9\u4e00-\u9fff]+$/,
  message: '暱稱只能包含中文、英文字母及數字'
};

const emailField = z.email('請輸入有效的信箱格式').max(255, '信箱長度不可超過 255 個字元');

export const registerSchema = z.object({
  body: z.object({
    email: emailField,
    password: z.string().min(8, '密碼長度至少為 8 個字元').max(30, '密碼長度不可超過 30 個字元').regex(
      ALPHANUMERIC_ONLY.pattern,
      ALPHANUMERIC_ONLY.message
    ),
    confirmPassword: z.string().min(1, '確認密碼不可為空'),
    nickname: z.string().trim().min(1, '暱稱不可為空').max(30, '暱稱長度不可超過 30 個字元').regex(
      NO_SPECIAL_CHARS.pattern,
      NO_SPECIAL_CHARS.message
    )
  }).refine(data => data.password === data.confirmPassword, {
    message: '確認密碼與密碼不一致',
    path: ['confirmPassword']
  })
});

export const verifyEmailOtpSchema = z.object({
  body: z.object({
    email: emailField,
    otp: z.string().length(6, 'OTP 驗證碼必須為 6 位數字').regex(/^\d{6}$/, 'OTP 驗證碼必須為 6 位數字')
  })
});

export const resendEmailOtpSchema = z.object({
  body: z.object({
    email: emailField
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: emailField,
    password: z.string().min(1, '密碼不可為空')
  })
});

export const updatePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, '舊密碼不可為空'),
    newPassword: z.string().min(8, '新密碼長度至少為 8 個字元').max(30, '新密碼長度不可超過 30 個字元').regex(
      ALPHANUMERIC_ONLY.pattern,
      ALPHANUMERIC_ONLY.message
    ),
    confirmPassword: z.string().min(1, '確認密碼不可為空')
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: '確認密碼與新密碼不一致',
    path: ['confirmPassword']
  })
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: emailField
  })
});

export const verifyPasswordOtpSchema = verifyEmailOtpSchema;

export type RegisterInput = Omit<z.infer<typeof registerSchema>['body'], 'confirmPassword'>;
export type LoginRequest = z.infer<typeof loginSchema>['body'];
export type UpdatePasswordRequest = z.infer<typeof updatePasswordSchema>['body'];
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>['body'];
export type VerifyPasswordOtpRequest = z.infer<typeof verifyPasswordOtpSchema>['body'];
