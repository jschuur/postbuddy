import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { unauthorised } from '@/app/api/apiUtils';
import { buildURL, isAdmin } from '@/lib/utils';

const adminRoutes = ['/feeds'];
const isAdminRoute = (path: string) => adminRoutes.find((route) => path.startsWith(route));

const redirect = (path: string) => NextResponse.redirect(buildURL(path));

export default authMiddleware({
  publicRoutes: ['/'],
  afterAuth: async (auth, req) => {
    const { userId, isPublicRoute, isApiRoute, sessionClaims } = auth;
    const { pathname: path } = req.nextUrl;

    if (!isPublicRoute) {
      if (!userId) return isApiRoute ? unauthorised : redirectToSignIn({ returnBackUrl: req.url });

      if (isAdminRoute(path) && !isAdmin(sessionClaims)) return redirect('/');
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
