import Posts from '@/components/posts/Posts';

export const revalidate = 0;

export default async function Home() {
  return (
    <main className='container mx-auto px-8 max-w-4xl grow'>
      <Posts />
    </main>
  );
}
