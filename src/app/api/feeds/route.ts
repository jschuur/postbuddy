import { NextResponse } from 'next/server';

import { getFeedsWithDetails } from '@/db/queries';

export async function GET(request: Request) {
  const feeds = await getFeedsWithDetails();

  return NextResponse.json(feeds);
}
