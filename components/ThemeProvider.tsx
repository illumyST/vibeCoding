"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (t: 'light' | 'dark') => void;
  resolved: boolean; // 是否已讀取使用者偏好，避免 Hydration Mismatch
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 先固定為 'light'，等到瀏覽器端再更新，避免伺服器預渲染與客戶端第一次 render 不同
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [resolved, setResolved] = useState(false);

  const applyTheme = useCallback((t: 'light' | 'dark') => {
    const root = document.documentElement;
    if (t === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  // 第一次在瀏覽器端解析偏好
  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme');
      let initial: 'light' | 'dark' = 'light';
      if (stored === 'light' || stored === 'dark') {
        initial = stored;
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) initial = 'dark';
      }
      setThemeState(initial);
      applyTheme(initial);
      setResolved(true);
    } catch {
      setResolved(true);
    }
  }, [applyTheme]);

  // 當 theme 改變時套用並儲存
  useEffect(() => {
    if (!resolved) return; // 尚未解析時不寫入，減少不必要 re-render
    applyTheme(theme);
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme, resolved, applyTheme]);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const setTheme = useCallback((t: 'light' | 'dark') => setThemeState(t), []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, resolved }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme 必須在 ThemeProvider 內使用');
  return ctx;
}
