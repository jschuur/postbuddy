import { PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

import FeedSheet from '@/components/feeds/FeedSheet';

export default function AddFeed() {
  return (
    <FeedSheet>
      <Button variant='outline' size='default' className='flax gap-2'>
        <PlusCircle className='h-4 w-4' />
        <span className='hidden sm:inline'>Add feed</span>
      </Button>
    </FeedSheet>
  );
}
