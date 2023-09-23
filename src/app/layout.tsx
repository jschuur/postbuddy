import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import './globals.css';

import { Toaster } from '@/components/ui/toaster';

import Header from '@/components/layout/Header';
import Providers from './providers';

import { cn } from '@/lib/utils';

const poppins = Poppins({ weight: ['300', '400', '500', '600'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PostBuddy',
  description: 'A friend that helps you post things.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={cn('flex flex-col', poppins.className)}>
          <Providers>
            <Header />
            {children}
            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
