import Posts from '@/components/posts/Posts';

export const revalidate = 0;

export default async function Home() {
  return <Posts />;
}
