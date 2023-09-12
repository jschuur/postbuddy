import FeedListTable from '@/components/feeds/FeedListTable';
import { map, pick } from 'lodash';

import { columns } from '@/components/feeds/FeedListTableColumns';
import { getFeedsWithDetails } from '@/db/queries';

export const revalidate = 0;

export default async function FeedsPage() {
  const feeds = await getFeedsWithDetails();
  const feedListData = map(feeds, (f) =>
    pick(f, [
      'name',
      'siteUrl',
      'itemCount',
      'lastCheckedAt',
      'lastPublishedAt',
      'lastErrorAt',
      'lastErrorMessage',
      'active',
    ])
  );

  return <FeedListTable data={feedListData} columns={columns} />;
}
