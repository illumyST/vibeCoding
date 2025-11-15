import { hashPassword, verifyPassword, authenticate } from '../../lib/auth';
import { prisma } from '../../lib/prisma';

// 簡易測試：確保 authenticate 對已建立管理員有效。

describe('auth password hashing', () => {
  it('hashes and verifies password', async () => {
    const raw = 'TestPass123';
    const hash = await hashPassword(raw);
    expect(hash).not.toBe(raw);
    const ok = await verifyPassword(raw, hash);
    expect(ok).toBe(true);
  });
});

describe('authenticate existing admin', () => {
  const email = 'test-admin@example.com';
  const password = 'InitPass456';
  beforeAll(async () => {
    // 若不存在就建立（不影響正式 seed）。
    const existing = await prisma.admin.findUnique({ where: { email } });
    if (!existing) {
      const passwordHash = await hashPassword(password);
      await prisma.admin.create({ data: { email, passwordHash, name: 'TestAdmin' } });
    }
  });
  it('authenticates with correct credentials', async () => {
    const admin = await authenticate(email, password);
    expect(admin.email).toBe(email);
  });
});
