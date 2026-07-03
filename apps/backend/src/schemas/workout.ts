import z from 'zod';

export const createUserWorkoutSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: '訓練名稱不可為空' }).max(30, { message: '訓練名稱長度不可超過 30 個字元' }),
    reflections: z.string().nullable()
  })
});

export const getWorkoutSchema = z.object({
  params: z.object({
    workoutId: z.uuid('請提供有效的 UUID')
  })
});

export type CreateUserWorkoutBody = z.infer<typeof createUserWorkoutSchema>['body'];
export type GetWorkoutParams = z.infer<typeof getWorkoutSchema>['params'];
