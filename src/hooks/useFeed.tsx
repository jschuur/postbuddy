'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { filter } from 'lodash';

import { type FeedWithDetails } from '@/db/queries';
import fetchFeeds from '@/hooks/fetchFeeds';

export default function useFeed(id: number | undefined) {
  const query = useSuspenseQuery({
    queryKey: ['feeds'],
    queryFn: fetchFeeds,
    select: (feeds: FeedWithDetails[]) => filter(feeds, (f) => f.id === id)?.[0],
  });

  return [query.data, query] as const;
}
