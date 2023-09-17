import { PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

import FeedSheet from '@/components/feeds/FeedSheet';

export default function AddFeed() {
  return (
    <FeedSheet>
      <Button variant='outline' size='default' className='ml-auto'>
        <PlusCircle className='h-4 w-4 mr-2' />
        <span>Add feed</span>
      </Button>
    </FeedSheet>
  );
}
