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
          <TableHead className='text-right'>Last Refreshed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {feeds.map((feed) => (
          <TableRow key={feed.id} className={cn(feed.active ? '' : 'text-gray-300')}>
            <TableCell className='font-medium'>
              {<a href={feed.siteUrl || ''}>{feed.name}</a>}
            </TableCell>
            <TableCell className='text-right'>{feed.entryCount}</TableCell>
            <TableCell className='text-right'>
              <FormattedDate date={feed.lastUpdatedAt} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
