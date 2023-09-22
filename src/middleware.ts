import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { buildURL } from './lib/utils';

const unauthorized = new NextResponse(undefined, {
  status: 401,
  statusText: 'Unauthorized',
});

const redirect = (path: string) => NextResponse.redirect(buildURL(path));

export default authMiddleware({
  publicRoutes: ['/'],
  afterAuth: (auth, req) => {
    const { userId, isApiRoute, isPublicRoute } = auth;

    if (!isPublicRoute) if (!userId) return redirectToSignIn({ returnBackUrl: req.url });

    if (process.env.ADMIN_USER_ID && userId !== process.env.ADMIN_USER_ID)
      return isApiRoute ? unauthorized : redirect('/');

    return NextResponse.next();
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
