import { NextResponse } from 'next/server';

export const unauthorised = new NextResponse(undefined, {
  status: 401,
  statusText: JSON.stringify({ status: 'unauthorised' }),
});
