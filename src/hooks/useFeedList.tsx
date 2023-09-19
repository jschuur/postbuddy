'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import fetchFeeds from '@/hooks/fetchFeeds';

export default function useFeedList() {
  const query = useSuspenseQuery({
    queryKey: ['feeds'],
    queryFn: fetchFeeds,
  });

  return [query.data, query] as const;
}
