import React from 'react';

interface MujiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export function MujiButton({
  variant = 'primary',
  loading = false,
  iconLeft,
  iconRight,
  className = '',
  children,
  disabled,
  ...rest
}: MujiButtonProps) {
  const base = 'muji-btn';
  const secondary = 'muji-btn-secondary';
  const danger = 'bg-[var(--muji-accent-red)] border-[var(--muji-accent-red)] hover:bg-[var(--muji-accent-red)]/90 text-white';

  const variantClass =
    variant === 'primary'
      ? base
      : variant === 'secondary'
      ? secondary
      : `${base} ${danger}`;

  return (
    <button
      className={`${variantClass} ${loading ? 'opacity-70 cursor-wait' : ''} ${className}`.trim()}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {iconLeft && <span className="mr-2" aria-hidden="true">{iconLeft}</span>}
      {loading ? '處理中…' : children}
      {iconRight && <span className="ml-2" aria-hidden="true">{iconRight}</span>}
    </button>
  );
}
