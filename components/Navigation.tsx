'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { DashboardIcon, MembersIcon, AddUserIcon, LogoutIcon } from './icons';

interface NavigationProps {
  children: React.ReactNode;
}

export default function Navigation({ children }: NavigationProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin'
      });
      window.location.href = '/login';
    } catch (error) {
      console.error('登出失敗:', error);
    }
  };

  const navItems = [
    { href: '/dashboard', label: '儀表板', Icon: DashboardIcon },
    { href: '/members', label: '會員管理', Icon: MembersIcon },
    { href: '/members/new', label: '新增會員', Icon: AddUserIcon }
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--muji-warm-white)' }}>
      <nav
        className="muji-nav sticky top-0 z-40"
        role="navigation"
        aria-label="主要導航"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 no-underline"
              aria-label="回到儀表板"
            >
              <span className="text-lg font-light tracking-wide" style={{ color: 'var(--muji-charcoal)' }}>
                會員管理系統
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-2">
              {navItems.map(item => {
                const active = pathname === item.href;
                const { Icon } = item;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${active ? 'bg-[var(--muji-beige)]' : 'hover:bg-[var(--muji-cream)]'}`}
                    style={{ color: 'var(--muji-charcoal)' }}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="muji-btn-secondary px-3 py-2 text-sm flex items-center gap-2"
              >
                <LogoutIcon />
                <span>登出</span>
              </button>
              <ThemeToggle className="ml-2 px-3 py-2 text-sm" />
            </div>
            <div className="md:hidden flex items-center">
              {/* 可在此加入行動裝置的抽屜菜單按鈕 */}
            </div>
          </div>
        </div>
        <div className="md:hidden px-2 pb-3 space-y-1">
          {navItems.map(item => {
            const active = pathname === item.href;
            const { Icon } = item;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${active ? 'bg-[var(--muji-beige)]' : 'hover:bg-[var(--muji-cream)]'}`}
                style={{ color: 'var(--muji-charcoal)' }}
                aria-current={active ? 'page' : undefined}
              >
                <Icon />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="flex gap-2">
            <button
              onClick={handleLogout}
              className="muji-btn-secondary flex-1 py-2 text-sm"
            >
              登出
            </button>
            <ThemeToggle className="py-2 text-sm" />
          </div>
        </div>
      </nav>
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="mt-8 py-8 text-center text-xs" style={{ color: 'var(--muji-soft-gray)' }}>
        © {new Date().getFullYear()} 會員管理系統 · 無印簡約風格 · WCAG AA 嘗試
      </footer>
    </div>
  );
}