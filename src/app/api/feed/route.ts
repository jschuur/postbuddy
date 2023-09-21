import { NextResponse } from 'next/server';

import { getErrorMessage } from '@/lib/utils';

import { addFeed } from '@/db/queries';
import { FeedInsertSchema } from '@/db/schema';

export async function POST(request: Request) {
  let values;

  try {
    if (!request.body) throw new Error('Missing feed add params (no body)');

    const body = await request.json();
    values = FeedInsertSchema.parse(body);

    const res = await addFeed(values);

    return NextResponse.json({ status: 'success', added: res });
  } catch (err) {
    console.error('feed POST error', { err, values });

    return NextResponse.json({ status: 'error', message: getErrorMessage(err) }, { status: 500 });
  }
}
