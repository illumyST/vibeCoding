import { prisma } from '../lib/prisma';
import { hashPassword } from '../lib/auth';

/**
 * 管理員種子：
 * 1. 若已存在任何 Admin，直接跳過（避免覆寫密碼）。
 * 2. 否則使用環境變數建立第一位管理員。
 * 3. 為了避免 email 已存在但非第一位的 edge case，仍採用 upsert（在 count=0 的情況下 create）。
 *    多次執行不會重複建立，也不會自動更新密碼。
 */
async function main() {
  const count = await prisma.admin.count();
  if (count === 0) {
    console.log('ℹ 尚未有管理員：現行策略改為「首次登入由使用者輸入建立」，種子腳本不再自動建立。');
  } else {
    console.log('✓ 已存在管理員，種子腳本不執行建立。');
  }
  console.log('若仍需預先建立，可臨時回退至舊版 seed 或直接在資料庫插入。');
}

main()
  .catch(e => {
    console.error('✗ 種子腳本執行失敗:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
