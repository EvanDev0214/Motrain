import z from 'zod';
import { nicknameField } from '@/schemas/auth';
import { weightUnitEnum } from '@/db/schemas';
import { httpUrlField } from '@/schemas/common';

export const updateUserProfileSchema = z.object({
  body: z.object({
    nickname: nicknameField.optional(),
    avatarUrl: httpUrlField.nullable().optional(),
    weightUnit: z.enum(weightUnitEnum.enumValues).optional()
  }).refine(
    data => Object.keys(data).length > 0,
    { message: '至少需要提供一個修改欄位' }
  )
});

export type UpdateUserProfileBody = z.infer<typeof updateUserProfileSchema>['body'];
