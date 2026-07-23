import z from 'zod';
import { rpeEnum, setTypeEnum } from '@/db/schemas';
import { uuidField, weightField } from '@/schemas/common';

const validateSequentialOrder = <T extends { order: number }>(items: T[], ctx: z.RefinementCtx) => {
  items.forEach((item, i) => {
    if (item.order !== i + 1) {
      ctx.addIssue({
        code: 'custom',
        message: `order 應為 ${i + 1}`,
        path: [i, 'order']
      });
    }
  });
};

const validateWeightExclusivity = (
  { weight, weightLeft, weightRight }: { weight: string | null; weightLeft: string | null; weightRight: string | null },
  ctx: z.RefinementCtx
) => {
  const hasWeight = weight !== null;
  const hasSplitWeight = weightLeft !== null || weightRight !== null;

  if (hasWeight && hasSplitWeight) {
    ctx.addIssue({
      code: 'custom',
      message: 'weight 與 weightLeft/weightRight 不可同時有值',
      path: ['weight']
    });
  }
};

export const createUserWorkoutSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: '訓練名稱不可為空' }).max(30, { message: '訓練名稱長度不可超過 30 個字元' }),
    reflections: z.string().nullable()
  })
});

export const getWorkoutSchema = z.object({
  params: z.object({
    workoutId: uuidField
  })
});

export const createUserWorkoutExercisesSchema = z.object({
  body: z.object({
    exercises: z.array(
      z.object({
        exerciseId: uuidField,
        order: z.number().int().min(1),
        supersetId: uuidField.nullable(),
        sets: z.array(
          z.object({
            setType: z.enum(setTypeEnum.enumValues),
            order: z.number().int().min(1),
            weight: weightField.nullable(),
            weightLeft: weightField.nullable(),
            weightRight: weightField.nullable(),
            reps: z.number().int().min(0).nullable(),
            rpe: z.enum(rpeEnum.enumValues).nullable(),
            note: z.string().nullable(),
            restSeconds: z.number().int().min(0).nullable()
          }).superRefine(validateWeightExclusivity)
        ).superRefine(validateSequentialOrder)
      }))
      .min(1, '至少新增一筆運動資料')
      .superRefine(validateSequentialOrder)
  }),
  params: z.object({
    workoutId: uuidField
  })
});

export const replaceUserWorkoutSchema = z.object({
  body: createUserWorkoutSchema.shape.body,
  params: z.object({
    workoutId: uuidField
  })
});

export const deleteUserWorkoutSchema = getWorkoutSchema;

export const replaceUserWorkoutExercisesSchema = createUserWorkoutExercisesSchema;

export type CreateUserWorkoutBody = z.infer<typeof createUserWorkoutSchema>['body'];
export type GetWorkoutParams = z.infer<typeof getWorkoutSchema>['params'];
export type CreateUserWorkoutExercisesBody = z.infer<typeof createUserWorkoutExercisesSchema>['body'];
export type CreateUserWorkoutExercisesParams = z.infer<typeof createUserWorkoutExercisesSchema>['params'];
export type ReplaceUserWorkoutBody = z.infer<typeof replaceUserWorkoutSchema>['body'];
export type ReplaceUserWorkoutParams = z.infer<typeof replaceUserWorkoutSchema>['params'];
export type DeleteUserWorkoutParams = z.infer<typeof deleteUserWorkoutSchema>['params'];
export type ReplaceUserWorkoutExercisesBody = z.infer<typeof replaceUserWorkoutExercisesSchema>['body'];
export type ReplaceUserWorkoutExercisesParams = z.infer<typeof replaceUserWorkoutExercisesSchema>['params'];
