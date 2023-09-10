import FeedItems from '@/components/feeditems/FeedItems';

export const revalidate = 0;

export default async function Home() {
  return <FeedItems />;
}
