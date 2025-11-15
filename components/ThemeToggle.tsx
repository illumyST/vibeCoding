"use client";
import React from 'react';
import { useTheme } from './ThemeProvider';
import { SunIcon, MoonIcon } from './icons';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme, resolved } = useTheme();
  // 在尚未 resolved 前，固定顯示 light 狀態避免與 SSR 不一致
  const effectiveTheme = resolved ? theme : 'light';
  const next = effectiveTheme === 'dark' ? '切換為淺色' : '切換為深色';
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={next}
      className={`muji-btn-secondary flex items-center gap-2 ${className}`}
      style={{ minWidth: '6rem' }}
    >
      {effectiveTheme === 'dark' ? <MoonIcon /> : <SunIcon />}
      <span>{effectiveTheme === 'dark' ? '深色' : '淺色'}</span>
    </button>
  );
}
