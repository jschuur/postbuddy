'use client';

import Account from '@/components/layout/Account';
import NavBar from '@/components/layout/NavBar';

export default function Header() {
  return (
    <header className='px-4 py-2 border-b-[1px] mb-4 bg-slate-100 flex justify-between'>
      <NavBar />
      <Account />
    </header>
  );
}
