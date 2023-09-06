import { getFeeds } from '@/db/queries';

export default async function FeedList() {
  const feeds = await getFeeds();

  return (
    <ul>
      {feeds.map((feed) => (
        <li key={feed.id}>
          <a href={feed.url || ''}>{feed.name}</a>
        </li>
      ))}
    </ul>
  );
}
