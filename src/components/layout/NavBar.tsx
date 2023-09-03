import Link from 'next/link';

import { cn } from '@/lib/utils';

export default function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
      <Link href='/' className='text-medium font-medium transition-colors hover:text-primary'>
        PostBuddy
      </Link>
      <Link
        href='/feeds'
        className='text-medium font-medium text-muted-foreground transition-colors hover:text-primary'
      >
        Manage Feeds
      </Link>
    </nav>
  );
}
