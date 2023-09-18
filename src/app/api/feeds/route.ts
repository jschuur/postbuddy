import { NextResponse } from 'next/server';

import { getFeedsWithDetails } from '@/db/queries';
import { getErrorMessage } from '@/lib/utils';

export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const feeds = await getFeedsWithDetails();

    return NextResponse.json(feeds);
  } catch (err) {
    console.error('feeds GET error', { err });

    return NextResponse.json({ status: 'error', message: getErrorMessage(err) }, { status: 500 });
  }
}
