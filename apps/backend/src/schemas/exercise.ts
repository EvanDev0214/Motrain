import z from 'zod';
import { defaultWeightModeEnum, equipmentEnum } from '@/db/schemas/exercises';

export const createUserExerciseSchema = z.object({
  body: z.object({
    name: z.string().min(1, '名稱不可為空').max(50, '名稱長度不可超過 50 個字元'),
    equipment: z.enum(equipmentEnum.enumValues),
    defaultWeightMode: z.enum(defaultWeightModeEnum.enumValues),
    mediaUrl: z.url('請提供有效的網址').nullable()
  })
});

export const getExerciseSchema = z.object({
  params: z.object({
    exerciseId: z.uuid('請提供有效的 UUID')
  })
});

export type CreateUserExerciseRequest = z.infer<typeof createUserExerciseSchema>['body'];
export type GetExerciseParams = z.infer<typeof getExerciseSchema>['params'];
