import pluralize from 'pluralize';

import FeedEntries from '@/components/FeedEntries';

import { getFeedEntriesCount, getFeedsCount } from '@/db/queries';

const feedEntriesCount = await getFeedEntriesCount();
const feedsCount = await getFeedsCount();

export default function Home() {
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
