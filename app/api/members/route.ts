import { NextRequest } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { memberCreateSchema } from '../../../lib/validation';
import { AppError, errorResponse } from '../../../lib/errors';
import { parseSessionCookie } from '../../../lib/auth';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get('page') || '1');
    const pageSize = Number(url.searchParams.get('pageSize') || '20');
    const where: any = {};
    const searchName = url.searchParams.get('searchName');
    const searchEmail = url.searchParams.get('searchEmail');
    const searchPhone = url.searchParams.get('searchPhone');
    if (searchName) where.name = { contains: searchName };
    if (searchEmail) where.email = { contains: searchEmail };
    if (searchPhone) where.phone = { contains: searchPhone };
    const skip = (page - 1) * pageSize;
    const [total, data] = await Promise.all([
      prisma.member.count({ where }),
      prisma.member.findMany({ where, skip, take: pageSize, orderBy: { createdAt: 'desc' } })
    ]);
    return Response.json({ data, page, total, totalPages: Math.ceil(total / pageSize) });
  } catch (e) { return errorResponse(e); }
}

export async function POST(req: NextRequest) {
  try {
    const cookie = req.headers.get('cookie');
    const adminId = parseSessionCookie(cookie || '');
    if (!adminId) throw new AppError('UNAUTHORIZED', '未登入', 401);
    const form = await req.formData();
    const payload = Object.fromEntries(form.entries());
    const parsed = memberCreateSchema.safeParse(payload);
    if (!parsed.success) throw new AppError('VALIDATION_ERROR', '資料格式錯誤', 400, parsed.error.flatten());
    const { name, phone, email, birthday, note } = parsed.data;
    const existing = await prisma.member.findUnique({ where: { email } });
    if (existing) throw new AppError('CONFLICT', 'Email 已存在', 409);
    const created = await prisma.member.create({ data: { name, phone, email, birthday: birthday ? new Date(birthday) : undefined, note } });
    return Response.json(created, { status: 201 });
  } catch (e) { return errorResponse(e); }
}
