import React from 'react';

interface MujiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  as?: 'div' | 'section' | 'article';
}

export function MujiCard({ title, subtitle, actions, as = 'div', className = '', children, ...rest }: MujiCardProps) {
  const Tag: any = as; // limit to block HTML elements only
  return (
    <Tag className={`muji-card ${className}`} {...rest}>
      {(title || actions) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && (
              <h2 className="text-lg font-light tracking-wide" style={{ color: 'var(--muji-charcoal)' }}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs mt-1" style={{ color: 'var(--muji-soft-gray)' }}>
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </Tag>
  );
}
