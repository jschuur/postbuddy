import FormattedDate from '@/components/FormattedDate';
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
        <TableRow className='font-medium'>
          <TableHead className=''>Name</TableHead>
          <TableHead className='text-right'>Items</TableHead>
          <TableHead className='text-right'>Last Checked</TableHead>
          <TableHead className='text-right'>Last Published</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className='text-sm'>
        {feeds.map((feed) => (
          <TableRow key={feed.id} className={cn(feed.active ? '' : 'text-gray-300')}>
            <TableCell className='font-medium'>
              {<a href={feed.siteUrl || ''}>{feed.name}</a>}
            </TableCell>
            <TableCell className='text-right'>{feed.feedItemCount}</TableCell>
            <TableCell className='text-right'>
              <span className='whitespace-nowrap'>
                <FormattedDate date={feed.lastCheckedAt} />
              </span>
            </TableCell>
            <TableCell className='text-right'>
              <span className='whitespace-nowrap'>
                <FormattedDate date={feed.lastPublishedAt} />
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
