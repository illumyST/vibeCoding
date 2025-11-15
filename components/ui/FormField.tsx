import React from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  description?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ id, label, required, description, error, children, className = '' }: FormFieldProps) {
  const describedBy = [error ? `${id}-error` : null, description ? `${id}-desc` : null]
    .filter(Boolean)
    .join(' ') || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="muji-label">
        {label} {required && <span className="text-red-600" aria-label="必填">*</span>}
      </label>
      {children}
      {description && !error && (
        <p id={`${id}-desc`} className="text-xs mt-1" style={{ color: 'var(--muji-soft-gray)' }}>
          {description}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs mt-1" style={{ color: 'var(--muji-accent-red)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
