import TimeAgo from '@/components/TimeAgo';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import pluralize from 'pluralize';

import { cn } from '@/lib/utils';

import { getFeedsWithDetails } from '@/db/queries';

export default async function FeedList() {
  const feeds = await getFeedsWithDetails();
  const feedCount = feeds.length;
  const feedCountActive = feeds.filter((feed) => feed.active).length;

  return (
    <Table>
      <TableCaption className='text-gray-600 font-light'>
        {pluralize('feed', feedCount, true)}
        {feedCount !== feedCountActive ? ` (${feedCountActive} active)` : null}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className='text-right'>Items</TableHead>
          <TableHead className='text-right whitespace-nowrap'>Last Checked</TableHead>
          <TableHead className='text-right whitespace-nowrap'>Last Published</TableHead>
          <TableHead className='whitespace-nowrap'>Last Error</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className='text-xs'>
        {feeds.map((feed) => (
          <TableRow key={feed.id} className={cn(feed.active ? '' : 'text-gray-300')}>
            <TableCell className='align-top'>
              {<a href={feed.siteUrl || ''}>{feed.name}</a>}
            </TableCell>
            <TableCell className='text-right align-top'>{feed.feedItemCount}</TableCell>
            <TableCell className='text-right align-top'>
              <TimeAgo date={feed.lastCheckedAt} />
            </TableCell>
            <TableCell className='text-right align-top'>
              <TimeAgo date={feed.lastPublishedAt} />
            </TableCell>
            <TableCell className='align-top'>
              {feed.lastErrorAt && (
                <div className='pb-2'>
                  <TimeAgo date={feed.lastErrorAt} />
                </div>
              )}
              {feed.lastErrorMessage && <div className='text-xs'>{feed.lastErrorMessage}</div>}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
