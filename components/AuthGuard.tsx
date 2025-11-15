import React from 'react';
import { cookies } from 'next/headers';

export async function AuthGuard({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  if (!session) {
    return <div className="p-6">未登入，<a className="text-blue-600" href="/login">前往登入</a></div>;
  }
  return <>{children}</>;
}
