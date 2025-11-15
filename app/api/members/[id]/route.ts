import { NextRequest } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { AppError, errorResponse } from '../../../../lib/errors';
import { memberCreateSchema } from '../../../../lib/validation';
import { parseSessionCookie } from '../../../../lib/auth';

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id: paramId } = await params;
    const id = Number(paramId);
    const member = await prisma.member.findUnique({ where: { id } });
    if (!member) throw new AppError('NOT_FOUND', '找不到會員', 404);
    return Response.json(member);
  } catch (e) { return errorResponse(e); }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const cookie = req.headers.get('cookie');
    const adminId = parseSessionCookie(cookie || '');
    if (!adminId) throw new AppError('UNAUTHORIZED', '未登入', 401);
    const { id: paramId } = await params;
    const id = Number(paramId);
    const member = await prisma.member.findUnique({ where: { id } });
    if (!member) throw new AppError('NOT_FOUND', '找不到會員', 404);
    const form = await req.formData();
    const payload = Object.fromEntries(form.entries());
    const parsed = memberCreateSchema.partial().safeParse(payload);
    if (!parsed.success) throw new AppError('VALIDATION_ERROR', '格式錯誤', 400, parsed.error.flatten());
    const { email } = parsed.data;
    if (email && email !== member.email) {
      const exists = await prisma.member.findUnique({ where: { email } });
      if (exists) throw new AppError('CONFLICT', 'Email 已存在', 409);
    }
    const updated = await prisma.member.update({ where: { id }, data: {
      ...parsed.data,
      birthday: parsed.data.birthday ? new Date(parsed.data.birthday) : member.birthday
    }});
    return Response.json(updated);
  } catch (e) { return errorResponse(e); }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const cookie = req.headers.get('cookie');
    const adminId = parseSessionCookie(cookie || '');
    if (!adminId) throw new AppError('UNAUTHORIZED', '未登入', 401);
    const { id: paramId } = await params;
    const id = Number(paramId);
    await prisma.member.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (e) { return errorResponse(e); }
}
