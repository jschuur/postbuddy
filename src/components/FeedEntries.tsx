import { getRecentEntries } from '@/db/queries';

export default async function FeedList() {
  const feedEntries = await getRecentEntries();

  return (
    <div>
      {feedEntries.map((entry) => (
        <div key={entry.guid}>
          <a href={entry.url || '#'}>{entry.title}</a>
        </div>
      ))}
    </div>
  );
}
