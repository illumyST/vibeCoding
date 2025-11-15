import { NextRequest } from 'next/server';
import { authenticate, createSessionCookie } from '../../../../lib/auth';
import { loginSchema } from '../../../../lib/validation';
import { errorResponse, AppError } from '../../../../lib/errors';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = loginSchema.safeParse(json);
    if (!parsed.success) throw new AppError('VALIDATION_ERROR', '登入資料不正確', 400, parsed.error.flatten());
    const admin = await authenticate(parsed.data.email, parsed.data.password);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Set-Cookie', createSessionCookie(admin.id));
    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  } catch (e) {
    return errorResponse(e);
  }
}
