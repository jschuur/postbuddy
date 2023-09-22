import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';

export default function Account() {
  return (
    <div>
      <SignedIn>
        <UserButton afterSignOutUrl={'/'} />
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <Button variant={'outline'} size={'sm'}>
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
