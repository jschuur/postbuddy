import { buildURL } from '@/lib/utils';

export default async function fetchFeeds() {
  const res = await (
    await fetch(buildURL('/api/feeds'), {
      cache: 'no-store',
    })
  ).json();

  return res;
}
