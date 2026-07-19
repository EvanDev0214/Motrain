import z from 'zod';
import dayjs from 'dayjs';

export const createBodyWeightSchema = z.object({
  body: z.object({
    weight: z.string().regex(/^\d{1,4}(\.\d{1,2})?$/, { message: '請輸入有效範圍的數字' }),
    recordedAt: z.string().refine(
      val => dayjs(val).isValid(),
      { message: '請提供有效的日期格式' }
    ).transform(val => dayjs.utc(val).startOf('day').toDate())
  })
});

export type CreateBodyWeightBody = z.infer<typeof createBodyWeightSchema>['body'];
