import { memberCreateSchema } from '../../lib/validation';

describe('member validation', () => {
  it('passes valid data', () => {
    const result = memberCreateSchema.safeParse({
      name: 'Alice',
      phone: '+886912345678',
      email: 'alice@example.com'
    });
    expect(result.success).toBe(true);
  });
  it('fails invalid phone', () => {
    const result = memberCreateSchema.safeParse({
      name: 'Bob',
      phone: 'abc',
      email: 'bob@example.com'
    });
    expect(result.success).toBe(false);
  });
});
