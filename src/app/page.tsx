import { SignedIn, SignedOut } from '@clerk/nextjs';
import { InfoCircledIcon } from '@radix-ui/react-icons';

import Posts from '@/components/posts/Posts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const revalidate = 0;

export default async function Home() {
  return (
    <main className='container max-w-4xl px-8 mx-auto grow'>
      <SignedIn>
        <Posts />
      </SignedIn>
      <SignedOut>
        <Alert className='m-8'>
          <InfoCircledIcon className='w-4 h-4' />
          <AlertTitle>Not signed in</AlertTitle>
          <AlertDescription>Filtered feed items would appear here.</AlertDescription>
        </Alert>
      </SignedOut>
    </main>
  );
}
