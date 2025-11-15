import { z } from 'zod';

export const memberCreateSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().min(1, "請輸入電話號碼").max(20, "電話號碼不可超過20個字元").refine(val => /\d/.test(val), "電話號碼必須包含數字"),
  email: z.string().email("請輸入有效的 Email 格式"),
  birthday: z.string().optional(), // ISO date string optional
  note: z.string().max(2000).optional()
});

export const memberUpdateSchema = memberCreateSchema.partial().extend({
  id: z.number().int().positive()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export type MemberCreateInput = z.infer<typeof memberCreateSchema>;
export type MemberUpdateInput = z.infer<typeof memberUpdateSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
