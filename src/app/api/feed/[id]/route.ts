import { NextResponse } from 'next/server';

import { getErrorMessage } from '@/lib/utils';

import { deleteFeed, updateFeed } from '@/db/queries';
import { FeedAPISchema } from '@/db/schema';

type Params = {
  id: string;
};

export async function PATCH(request: Request, { params }: { params: Params }) {
  const id = parseInt(params.id, 10);

  try {
    if (!request.body) throw new Error('Missing feed update params (no body)');

    const body = await request.json();
    const values = FeedAPISchema.omit({ id: true }).partial().parse(body);

    await updateFeed(id, values);

    return NextResponse.json({ status: 'success', updated: { id, ...values } });
  } catch (err) {
    console.error('feed PATCH error', { err });

    return NextResponse.json({ status: 'error', message: getErrorMessage(err) }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  const id = parseInt(params.id, 10);

  try {
    await deleteFeed(id);

    return NextResponse.json({ status: 'success' });
  } catch (err) {
    console.error('feed DELETE error', { err });

    return NextResponse.json({ status: 'error', message: getErrorMessage(err) }, { status: 500 });
  }
}
