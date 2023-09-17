'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { map, pick } from 'lodash';

import { type FeedWithDetails } from '@/db/queries';
import fetchFeeds from '@/hooks/fetchFeeds';

export default function useFeedList() {
  const query = useSuspenseQuery({
    queryKey: ['feeds'],
    queryFn: fetchFeeds,
    select: (feeds: FeedWithDetails[]) =>
      map(feeds, (f) =>
        pick(f, [
          'id',
          'name',
          'siteUrl',
          'url',
          'itemCount',
          'lastCheckedAt',
          'lastPublishedAt',
          'lastErrorAt',
          'lastErrorMessage',
          'active',
        ])
      ),
  });

  return [query.data, query] as const;
}
