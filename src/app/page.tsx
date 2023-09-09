import pluralize from 'pluralize';

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
        feeds.
      </p>
      <FeedEntries />
    </>
  );
}
