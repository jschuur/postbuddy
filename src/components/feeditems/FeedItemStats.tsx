import pluralize from 'pluralize';

import { DEFAULT_ITEM_LIST_LIMIT } from '@/config';

import { getFeedCount, getFeedItemCount } from '@/db/queries';

export default async function FeedItemStats() {
  const feedItemCount = await getFeedItemCount();
  const feedCount = await getFeedCount();

  return (
    <p className='py-4'>
      {pluralize('feed item', feedItemCount, true)} from {pluralize('feed', feedCount, true)}.{' '}
      {feedItemCount > DEFAULT_ITEM_LIST_LIMIT
        ? `Showing most recent ${DEFAULT_ITEM_LIST_LIMIT}:`
        : ''}
    </p>
  );
}
