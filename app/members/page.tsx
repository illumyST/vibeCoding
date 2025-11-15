import React from 'react';
import { prisma } from '../../lib/prisma';
import Navigation from '../../components/Navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MembersPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[]>> }) {
  const params = await searchParams;
  const page = Number(params?.page || 1);
  const pageSize = 20;
  const skip = (page - 1) * pageSize;
  const where: any = {};
  const searchName = params?.searchName as string | undefined;
  const searchEmail = params?.searchEmail as string | undefined;
  const searchPhone = params?.searchPhone as string | undefined;
  
  if (searchName) where.name = { contains: searchName };
  if (searchEmail) where.email = { contains: searchEmail };
  if (searchPhone) where.phone = { contains: searchPhone };
  
  const [total, members] = await Promise.all([
    prisma.member.count({ where }),
    prisma.member.findMany({ where, skip, take: pageSize, orderBy: { createdAt: 'desc' } })
  ]);
  
  const totalPages = Math.ceil(total / pageSize);
  const hasFilters = searchName || searchEmail || searchPhone;

  return (
    <Navigation>
      <div className="space-y-6">
        {/* 頁面標題 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-light mb-2" style={{ color: 'var(--muji-charcoal)' }}>
              會員管理
            </h1>
            <p className="text-sm" style={{ color: 'var(--muji-soft-gray)' }}>
              共 {total.toLocaleString()} 位會員
              {hasFilters && ` (已篩選)`}
            </p>
          </div>
          <Link 
            href="/members/new" 
            className="muji-btn mt-4 sm:mt-0"
          >
            <span className="mr-2" aria-hidden="true">➕</span>
            新增會員
          </Link>
        </div>

        {/* 搜尋表單 */}
        <div className="muji-card">
          <h2 className="text-lg font-light mb-4" style={{ color: 'var(--muji-charcoal)' }}>
            搜尋會員
          </h2>
          <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" method="GET">
            <div>
              <label htmlFor="searchName" className="muji-label">
                姓名
              </label>
              <input 
                id="searchName"
                name="searchName" 
                defaultValue={searchName || ''}
                placeholder="輸入會員姓名" 
                className="muji-input" 
              />
            </div>
            <div>
              <label htmlFor="searchEmail" className="muji-label">
                電子郵件
              </label>
              <input 
                id="searchEmail"
                name="searchEmail" 
                defaultValue={searchEmail || ''}
                placeholder="輸入電子郵件" 
                className="muji-input"
                type="email"
              />
            </div>
            <div>
              <label htmlFor="searchPhone" className="muji-label">
                電話號碼
              </label>
              <input 
                id="searchPhone"
                name="searchPhone" 
                defaultValue={searchPhone || ''}
                placeholder="輸入電話號碼" 
                className="muji-input"
                type="tel"
              />
            </div>
            <div className="flex items-end space-x-2">
              <button type="submit" className="muji-btn">
                搜尋
              </button>
              {hasFilters && (
                <Link 
                  href="/members" 
                  className="muji-btn-secondary"
                >
                  清除
                </Link>
              )}
            </div>
          </form>
        </div>

        {/* 會員列表 */}
        <div className="muji-card overflow-hidden">
          {members.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="muji-table" role="table">
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">姓名</th>
                      <th scope="col">電子郵件</th>
                      <th scope="col">電話號碼</th>
                      <th scope="col">加入日期</th>
                      <th scope="col">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member: any) => (
                      <tr key={member.id}>
                        <td>{member.id}</td>
                        <td className="font-medium">{member.name}</td>
                        <td>{member.email}</td>
                        <td>{member.phone}</td>
                        <td>{member.createdAt.toLocaleDateString('zh-TW')}</td>
                        <td>
                          <Link 
                            href={`/members/${member.id}/edit`} 
                            className="muji-link text-sm"
                            aria-label={`編輯 ${member.name} 的資料`}
                          >
                            編輯
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 分頁導航 */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center space-x-2">
                  <nav aria-label="分頁導航" className="flex space-x-1">
                    {page > 1 && (
                      <Link 
                        href={`?page=${page - 1}${searchName ? `&searchName=${searchName}` : ''}${searchEmail ? `&searchEmail=${searchEmail}` : ''}${searchPhone ? `&searchPhone=${searchPhone}` : ''}`}
                        className="muji-btn-secondary px-3 py-2 text-sm"
                        aria-label="上一頁"
                      >
                        ←
                      </Link>
                    )}
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                      if (pageNum > totalPages) return null;
                      
                      return (
                        <Link
                          key={pageNum}
                          href={`?page=${pageNum}${searchName ? `&searchName=${searchName}` : ''}${searchEmail ? `&searchEmail=${searchEmail}` : ''}${searchPhone ? `&searchPhone=${searchPhone}` : ''}`}
                          className={`px-3 py-2 text-sm rounded transition-colors ${
                            pageNum === page 
                              ? 'muji-btn' 
                              : 'muji-btn-secondary'
                          }`}
                          aria-label={`第 ${pageNum} 頁`}
                          aria-current={pageNum === page ? 'page' : undefined}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}
                    
                    {page < totalPages && (
                      <Link 
                        href={`?page=${page + 1}${searchName ? `&searchName=${searchName}` : ''}${searchEmail ? `&searchEmail=${searchEmail}` : ''}${searchPhone ? `&searchPhone=${searchPhone}` : ''}`}
                        className="muji-btn-secondary px-3 py-2 text-sm"
                        aria-label="下一頁"
                      >
                        →
                      </Link>
                    )}
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4" aria-hidden="true">👤</div>
              <h3 className="text-lg font-light mb-2" style={{ color: 'var(--muji-charcoal)' }}>
                {hasFilters ? '找不到符合條件的會員' : '尚無會員資料'}
              </h3>
              <p className="text-sm mb-6" style={{ color: 'var(--muji-soft-gray)' }}>
                {hasFilters 
                  ? '請嘗試調整搜尋條件' 
                  : '立即新增第一位會員開始使用'
                }
              </p>
              {!hasFilters && (
                <Link href="/members/new" className="muji-btn">
                  新增會員
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </Navigation>
  );
}
