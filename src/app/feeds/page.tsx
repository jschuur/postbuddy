import { Suspense } from 'react';

import FeedListTable from '@/components/feeds/FeedListTable';

import Loading from '@/app/loading';

export default function FeedsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <FeedListTable />
    </Suspense>
  );
}
