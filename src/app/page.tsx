import pluralize from 'pluralize';

import { DEFAULT_ITEM_LIST_LIMIT } from '@/config';

import FeedEntries from '@/components/feedentry/FeedEntries';

import { getFeedEntriesCount, getFeedsCount } from '@/db/queries';

export const revalidate = 0;

export default async function Home() {
  const feedEntriesCount = await getFeedEntriesCount();
  const feedsCount = await getFeedsCount();

  return (
    <>
      <p className='py-4'>
        {pluralize('feed entry', feedEntriesCount, true)} from {pluralize('feed', feedsCount, true)}{' '}
        feeds.{' '}
        {feedEntriesCount > DEFAULT_ITEM_LIST_LIMIT
          ? `Showing most recent ${DEFAULT_ITEM_LIST_LIMIT}:`
          : ''}
      </p>
      <FeedEntries />
    </>
  );
}
