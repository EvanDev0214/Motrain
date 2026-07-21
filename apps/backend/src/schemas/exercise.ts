import z from 'zod';
import { defaultWeightModeEnum, equipmentEnum } from '@/db/schemas/exercises';
import { muscleRoleEnum } from '@/db/schemas/exerciseMuscles';
import { httpUrlField, uuidField } from '@/schemas/common';

export const createUserExerciseSchema = z.object({
  body: z.object({
    name: z.string().min(1, '名稱不可為空').max(50, '名稱長度不可超過 50 個字元'),
    equipment: z.enum(equipmentEnum.enumValues),
    defaultWeightMode: z.enum(defaultWeightModeEnum.enumValues),
    mediaUrl: httpUrlField.nullable(),
    muscles: z.array(
      z.object({
        muscleId: uuidField,
        muscleRole: z.enum(muscleRoleEnum.enumValues, '請提供有效的肌群定位 primary 或 secondary')
      }))
      .min(1, '至少需要指定一個肌群')
      .refine((muscles) => {
        const muscleIds = muscles.map(m => m.muscleId);
        return new Set(muscleIds).size === muscleIds.length;
      }, '肌群不能重複')
  })
});

export const getExerciseSchema = z.object({
  params: z.object({
    exerciseId: uuidField
  })
});

export const replaceExerciseSchema = z.object({
  params: z.object({
    exerciseId: uuidField
  }),
  body: createUserExerciseSchema.shape.body
});

export const deleteExerciseSchema = getExerciseSchema;

export const getExerciseHistorySchema = z.object({
  params: z.object({
    exerciseId: uuidField
  })
});

export type CreateUserExerciseBody = z.infer<typeof createUserExerciseSchema>['body'];
export type GetExerciseParams = z.infer<typeof getExerciseSchema>['params'];
export type ReplaceExerciseBody = z.infer<typeof replaceExerciseSchema>['body'];
export type ReplaceExerciseParams = z.infer<typeof replaceExerciseSchema>['params'];
export type DeleteExerciseParams = z.infer<typeof deleteExerciseSchema>['params'];
export type GetExerciseHistoryParams = z.infer<typeof getExerciseHistorySchema>['params'];
