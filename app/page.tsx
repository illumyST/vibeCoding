import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--muji-warm-white)' }}>
      <main id="main-content" className="text-center max-w-md mx-auto px-6">
        <div className="muji-card">
          <div className="mb-8">
            <h1 className="text-2xl font-light mb-4" style={{ color: 'var(--muji-charcoal)' }}>
              會員管理系統
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muji-soft-gray)' }}>
              簡潔優雅的會員管理平台<br />
              為您提供直觀的操作體驗
            </p>
          </div>
          
          <div className="space-y-4">
            <Link 
              href="/login" 
              className="muji-btn block text-center no-underline"
              role="button"
              aria-label="前往管理員登入頁面"
            >
              管理員登入
            </Link>
            
            <p className="text-xs" style={{ color: 'var(--muji-soft-gray)' }}>
              需要管理員權限才能使用此系統
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}