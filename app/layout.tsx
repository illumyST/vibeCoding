import React from 'react';
import './global.css';
import ThemeProvider from '../components/ThemeProvider';

export const metadata = {
  title: '會員管理系統 - 簡約無印風格',
  description: '簡潔優雅的會員管理系統，符合無障礙設計標準',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#a68b5b" />
        {/* SSR 初始載入時立即套用使用者儲存的主題，減少 FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{try{const t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark');}else if(t==='light'){document.documentElement.classList.remove('dark');}else{const m=window.matchMedia('(prefers-color-scheme: dark)').matches; if(m) document.documentElement.classList.add('dark');}}catch(e){}})();`
          }}
        />
      </head>
      <body className="min-h-screen" suppressHydrationWarning style={{ backgroundColor: 'var(--muji-warm-white)', color: 'var(--muji-charcoal)' }}>
        <a href="#main-content" className="skip-link">
          跳到主要內容
        </a>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
