import React from 'react';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-gray-900 text-white p-4 space-y-4">
        <h2 className="font-bold">後台</h2>
        <nav className="flex flex-col space-y-2 text-sm">
          <a href="/dashboard" className="hover:underline">Dashboard</a>
          <a href="/members" className="hover:underline">會員列表</a>
          <form action="/api/auth/logout" method="POST"><button className="mt-4 text-left hover:underline">登出</button></form>
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
