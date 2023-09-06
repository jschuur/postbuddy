import FeedEntry from '@/components/feedentry/FeedEntry';

import { getRecentEntries } from '@/db/queries';

export default async function FeedList() {
  const feedEntries = await getRecentEntries();

  return (
    <div className='grid grid-cols-[1fr_200px)]'>
      {feedEntries.map(({ feedEntries: entry, feeds: feed }) => (
        <FeedEntry key={entry.guid} entry={entry} feed={feed!} />
      ))}
    </div>
  );
}
