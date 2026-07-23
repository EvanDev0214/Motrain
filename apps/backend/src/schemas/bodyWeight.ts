import z from 'zod';
import dayjs from '@/configs/dayjs';
import { uuidField, weightField } from '@/schemas/common';

export const createBodyWeightSchema = z.object({
  body: z.object({
    weight: weightField,
    recordedAt: z.string().refine(
      val => dayjs(val).isValid(),
      { message: '請提供有效的日期格式' }
    ).transform(val => dayjs.utc(val).startOf('day').toDate())
  })
});

export const deleteBodyWeightSchema = z.object({
  params: z.object({
    bodyWeightId: uuidField
  })
});

export type CreateBodyWeightBody = z.infer<typeof createBodyWeightSchema>['body'];
export type DeleteBodyWeightParams = z.infer<typeof deleteBodyWeightSchema>['params'];
