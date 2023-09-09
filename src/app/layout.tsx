import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import './globals.css';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

import { cn } from '@/lib/utils';

const poppins = Poppins({ weight: ['300', '400', '500', '600'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PostBuddy',
  description: 'A friend that helps you post things.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={cn('flex flex-col h-screen', poppins.className)}>
        <Header />
        <main className='container mx-auto px-8 max-w-2xl grow'>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
