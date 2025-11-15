import { prisma } from '../lib/prisma';
import { hashPassword } from '../lib/auth';

async function main() {
  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;
  const name = 'Default Admin';
  if (!email || !password) {
    console.error('缺少 ADMIN_SEED_EMAIL 或 ADMIN_SEED_PASSWORD 環境變數');
    process.exit(1);
  }
  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log('Admin 已存在，跳過建立');
    return;
  }
  const passwordHash = await hashPassword(password);
  await prisma.admin.create({ data: { email, passwordHash, name } });
  console.log('Admin 建立完成');
}

main().catch(e => { console.error(e); process.exit(1); });
