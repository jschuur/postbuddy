import { useSession } from '@clerk/nextjs';
import { Inbox } from 'lucide-react';
import Link from 'next/link';

import { cn, isAdmin } from '@/lib/utils';

export default function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const { session } = useSession();

  return (
    <nav className={cn('flex items-center gap-2 lg:gap-4', className)} {...props}>
      <Link
        href='/'
        className='flex items-center gap-2 font-medium transition-colors text-medium hover:text-primary'
      >
        <Inbox />
        <span className='hidden sm:inline'>PostBuddy</span>
      </Link>
      <Link
        href='/items'
        className='font-medium transition-colors text-medium text-muted-foreground hover:text-primary'
      >
        Items
      </Link>
      {isAdmin(session) ? (
        <Link
          href='/feeds'
          className='font-medium transition-colors text-medium text-muted-foreground hover:text-primary'
        >
          Feeds
        </Link>
      ) : null}
    </nav>
  );
}
