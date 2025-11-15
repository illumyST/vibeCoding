import React from 'react';
import { MemberCreateInput } from '../lib/validation';

interface Props {
  defaultValues?: Partial<MemberCreateInput & { id?: number; birthday?: string }>;
  action: string;
  submitLabel: string;
}

export function MemberForm({ defaultValues, action, submitLabel }: Props) {
  return (
    <form action={action} method="POST" className="space-y-3">
      <input name="name" defaultValue={defaultValues?.name} required placeholder="姓名" className="w-full border px-3 py-2" />
      <input name="phone" defaultValue={defaultValues?.phone} required placeholder="電話" className="w-full border px-3 py-2" />
      <input name="email" defaultValue={defaultValues?.email} required type="email" placeholder="Email" className="w-full border px-3 py-2" />
      <input name="birthday" defaultValue={defaultValues?.birthday} type="date" className="w-full border px-3 py-2" />
      <textarea name="note" defaultValue={defaultValues?.note} placeholder="備註" className="w-full border px-3 py-2" />
      <button className="bg-blue-600 text-white px-4 py-2">{submitLabel}</button>
    </form>
  );
}
