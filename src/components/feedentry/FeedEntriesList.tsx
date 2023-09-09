import FeedEntry from '@/components/feedentry/FeedEntry';

import { getRecentEntries } from '@/db/queries';

import { DEFAULT_ITEM_LIST_LIMIT } from '@/config';

export default async function FeedEntriesList() {
  const feedEntries = await getRecentEntries({
    limit: DEFAULT_ITEM_LIST_LIMIT,
    includeSeen: false,
  });

  return (
    <div className='grid grid-cols-[1fr_200px)]'>
      {feedEntries.map(({ feedEntries: entry, feeds: feed }) => (
        <FeedEntry key={entry.guid} entry={entry} feed={feed!} />
      ))}
    </div>
  );
}
