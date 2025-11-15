import React from 'react';
import { Member } from '@prisma/client';

export function MemberTable({ members }: { members: Member[] }) {
  return (
    <table className="w-full border text-sm">
      <thead><tr className="bg-gray-100"><th className="border p-2">ID</th><th className="border p-2">姓名</th><th className="border p-2">Email</th><th className="border p-2">電話</th><th className="border p-2">操作</th></tr></thead>
      <tbody>
        {members.map(m => (
          <tr key={m.id}>
            <td className="border p-2">{m.id}</td>
            <td className="border p-2">{m.name}</td>
            <td className="border p-2">{m.email}</td>
            <td className="border p-2">{m.phone}</td>
            <td className="border p-2"><a className="text-blue-600" href={`/members/${m.id}/edit`}>編輯</a></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
