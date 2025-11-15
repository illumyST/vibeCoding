import { NextRequest } from 'next/server';
import { authenticate, createSessionCookie, hashPassword } from '../../../../lib/auth';
import { loginSchema } from '../../../../lib/validation';
import { errorResponse, AppError } from '../../../../lib/errors';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = loginSchema.safeParse(json);
    if (!parsed.success) throw new AppError('VALIDATION_ERROR', '登入資料不正確', 400, parsed.error.flatten());

    const { email, password } = parsed.data;

    // 使用 transaction：若尚無任何管理員，直接用使用者輸入建立第一位。
  const { admin, firstCreated } = await prisma.$transaction(async (tx: typeof prisma) => {
      const count = await tx.admin.count();
      if (count === 0) {
        const passwordHash = await hashPassword(password);
        const created = await tx.admin.create({
          data: { email, passwordHash, name: '管理員' }
        });
        return { admin: created, firstCreated: true };
      }
      const existing = await tx.admin.findUnique({ where: { email } });
      return { admin: existing, firstCreated: false };
    });

    if (!admin) {
      // 管理員已存在但找不到該 email
      throw new AppError('AUTH_FAILED', '帳號或密碼錯誤', 401);
    }

    // 若不是剛建立則驗證密碼
    if (!firstCreated) {
      await authenticate(email, password); // 內部會校驗密碼並在錯誤時拋出
    }

    const headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Set-Cookie', createSessionCookie(admin.id));
    return new Response(
      JSON.stringify({ success: true, firstAdminAutoCreated: firstCreated }),
      { status: 200, headers }
    );
  } catch (e) {
    return errorResponse(e);
  }
}
