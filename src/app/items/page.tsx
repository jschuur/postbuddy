import FeedItems from '@/components/feeditems/FeedItems';

export const revalidate = 0;

export default async function ItemsPage() {
  return (
    <main className='container mx-auto px-8 max-w-4xl grow'>
      <FeedItems />
    </main>
  );
}
