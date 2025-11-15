import React from 'react';
import { prisma } from '../../lib/prisma';
import { parseSessionCookie } from '../../lib/auth';
import Navigation from '../../components/Navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // 簡易保護：若無 session 則顯示未登入
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  let adminId: number | null = null;
  if (sessionCookie?.value) adminId = Number(sessionCookie.value);
  
  if (!adminId) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--muji-warm-white)' }}>
        <div className="muji-card text-center">
          <h1 className="text-xl font-light mb-4" style={{ color: 'var(--muji-charcoal)' }}>
            未登入
          </h1>
          <p className="mb-6" style={{ color: 'var(--muji-soft-gray)' }}>
            請先登入以使用管理功能
          </p>
          <Link href="/login" className="muji-btn">
            前往登入
          </Link>
        </div>
      </div>
    );
  }

  // 獲取統計數據
  const [memberCount, recentMembers] = await Promise.all([
    prisma.member.count(),
    prisma.member.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    })
  ]);

  return (
    <Navigation>
      <div className="space-y-8">
        {/* 頁面標題 */}
        <div>
          <h1 className="text-2xl font-light mb-2" style={{ color: 'var(--muji-charcoal)' }}>
            儀表板
          </h1>
          <p className="text-sm" style={{ color: 'var(--muji-soft-gray)' }}>
            系統概覽與快速操作
          </p>
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="muji-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--muji-soft-gray)' }}>
                  會員總數
                </p>
                <p className="text-3xl font-light mt-2" style={{ color: 'var(--muji-brown)' }}>
                  {memberCount.toLocaleString()}
                </p>
              </div>
              <div className="text-3xl" aria-hidden="true">👥</div>
            </div>
          </div>

          <div className="muji-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--muji-soft-gray)' }}>
                  本月新增
                </p>
                <p className="text-3xl font-light mt-2" style={{ color: 'var(--muji-success-green)' }}>
                  {recentMembers.length}
                </p>
              </div>
              <div className="text-3xl" aria-hidden="true">📈</div>
            </div>
          </div>

          <div className="muji-card">
            <Link 
              href="/members/new" 
              className="muji-link no-underline block h-full"
              aria-label="新增會員"
            >
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <div className="text-3xl mb-2" aria-hidden="true">➕</div>
                  <p className="text-sm font-medium" style={{ color: 'var(--muji-brown)' }}>
                    新增會員
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* 最近新增的會員 */}
        <div className="muji-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-light" style={{ color: 'var(--muji-charcoal)' }}>
              最近新增的會員
            </h2>
            <Link 
              href="/members" 
              className="muji-link text-sm"
              aria-label="查看所有會員"
            >
              查看全部 →
            </Link>
          </div>

          {recentMembers.length > 0 ? (
            <div className="space-y-3">
              {recentMembers.map((member: any, index: number) => (
                <div 
                  key={member.id} 
                  className="flex items-center justify-between py-3 border-b last:border-b-0"
                  style={{ borderColor: 'var(--muji-light-gray)' }}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                      style={{ 
                        backgroundColor: 'var(--muji-beige)', 
                        color: 'var(--muji-brown)' 
                      }}
                      aria-hidden="true"
                    >
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--muji-charcoal)' }}>
                        {member.name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--muji-soft-gray)' }}>
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--muji-soft-gray)' }}>
                    {member.createdAt.toLocaleDateString('zh-TW')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4" aria-hidden="true">📋</div>
              <p className="text-sm" style={{ color: 'var(--muji-soft-gray)' }}>
                尚無會員資料
              </p>
              <Link 
                href="/members/new" 
                className="muji-btn mt-4 inline-block"
              >
                立即新增第一位會員
              </Link>
            </div>
          )}
        </div>
      </div>
    </Navigation>
  );
}
