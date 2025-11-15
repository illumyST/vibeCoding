import React from 'react';

export function SearchBar() {
  return (
    <form className="mb-4 flex gap-2">
      <input name="searchName" placeholder="姓名" className="border px-2 py-1" />
      <input name="searchEmail" placeholder="Email" className="border px-2 py-1" />
      <input name="searchPhone" placeholder="電話" className="border px-2 py-1" />
      <button className="bg-gray-800 text-white px-3 py-1">搜尋</button>
    </form>
  );
}
