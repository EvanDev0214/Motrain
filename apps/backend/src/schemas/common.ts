import z from 'zod';

export const uuidField = z.uuid('請提供有效的 UUID');
export const weightField = z.string().regex(/^\d{1,4}(\.\d{1,2})?$/, { message: '請輸入有效範圍的數字' });
export const httpUrlField = z.url({ protocol: /^https?$/, message: '請提供有效網址' });
