import { Suspense } from 'react';

import FeedListTable from '@/components/feeds/FeedListTable';

import Loading from '@/app/loading';

export const revalidate = 0;

export default function FeedsPage() {
  return (
    <main className='container mx-auto px-8 max-w-6xl grow'>
      <Suspense fallback={<Loading />}>
        <FeedListTable />
      </Suspense>
    </main>
  );
}
