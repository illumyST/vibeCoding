import { hashPassword, verifyPassword } from '../../lib/auth';

describe('auth password hashing', () => {
  it('hashes and verifies password', async () => {
    const raw = 'TestPass123';
    const hash = await hashPassword(raw);
    expect(hash).not.toBe(raw);
    const ok = await verifyPassword(raw, hash);
    expect(ok).toBe(true);
  });
});
