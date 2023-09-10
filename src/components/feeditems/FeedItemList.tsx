import FeedItem from '@/components/feeditems/FeedItem';

import { getRecentFeedItems } from '@/db/queries';

import { DEFAULT_ITEM_LIST_LIMIT } from '@/config';

export default async function FeedItemList() {
  const feedItems = await getRecentFeedItems({
    limit: DEFAULT_ITEM_LIST_LIMIT,
    includeSeen: false,
  });

  return (
    <div className='grid grid-cols-[1fr_200px)]'>
      {feedItems.map(({ feed_items: item, feeds: feed }) => (
        <FeedItem key={item.guid} item={item} feed={feed!} />
      ))}
    </div>
  );
}
