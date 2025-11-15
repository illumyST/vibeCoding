import React from 'react';

interface Props { page: number; totalPages: number; baseUrl?: string }
export function Pagination({ page, totalPages, baseUrl = '' }: Props) {
  return (
    <div className="flex gap-2 mt-4">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <a key={p} href={`${baseUrl}?page=${p}`} className={`px-2 py-1 border ${p === page ? 'bg-blue-600 text-white' : ''}`}>{p}</a>
      ))}
    </div>
  );
}
