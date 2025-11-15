'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'same-origin'
      });
      
      if (res.ok) {
        window.location.href = '/dashboard';
      } else {
        const data = await res.json();
        setError(data.message || '登入失敗，請檢查您的帳號密碼');
      }
    } catch (err) {
      setError('網路連線錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--muji-warm-white)' }}>
      <main id="main-content" className="w-full max-w-sm">
        <div className="muji-card">
          <div className="text-center mb-8">
            <h1 className="text-xl font-light mb-2" style={{ color: 'var(--muji-charcoal)' }}>
              管理員登入
            </h1>
            <p className="text-sm" style={{ color: 'var(--muji-soft-gray)' }}>
              請輸入您的登入資訊
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label 
                htmlFor="email" 
                className="muji-label"
              >
                電子郵件
              </label>
              <input 
                id="email"
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="muji-input" 
                placeholder="請輸入電子郵件"
                required 
                aria-describedby={error ? "error-message" : undefined}
                autoComplete="email"
              />
            </div>
            
            <div>
              <label 
                htmlFor="password" 
                className="muji-label"
              >
                密碼
              </label>
              <input 
                id="password"
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="muji-input" 
                placeholder="請輸入密碼"
                required 
                aria-describedby={error ? "error-message" : undefined}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div 
                id="error-message" 
                className="muji-error" 
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="muji-btn w-full"
              disabled={loading}
              aria-describedby={loading ? "loading-status" : undefined}
            >
              {loading ? '登入中...' : '登入'}
            </button>
            
            {loading && (
              <div 
                id="loading-status" 
                className="sr-only" 
                aria-live="polite"
              >
                正在處理登入請求
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/" 
              className="muji-link text-sm"
              aria-label="返回首頁"
            >
              ← 返回首頁
            </Link>
          </div>

          <div className="mt-6 p-4 rounded" style={{ backgroundColor: 'var(--muji-beige)' }}>
            <p className="text-xs" style={{ color: 'var(--muji-soft-gray)' }}>
              <strong>測試帳號：</strong><br />
              Email: admin@example.com<br />
              密碼: ChangeMe123
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
