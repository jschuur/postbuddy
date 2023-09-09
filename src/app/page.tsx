import FeedEntries from '@/components/feedentry/FeedEntries';

export const revalidate = 0;

export default async function Home() {
  return <FeedEntries />;
}
