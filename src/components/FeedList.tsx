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

import { getFeeds } from '@/db/queries';

export default async function FeedList() {
  const feeds = await getFeeds();

  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow className='font-medium'>
          <TableHead className=''>Name</TableHead>
          <TableHead className='text-right'>Last Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {feeds.map((feed) => (
          <TableRow key={feed.id}>
            <TableCell className='font-medium'>
              {<a href={feed.url || ''}>{feed.name}</a>}
            </TableCell>
            <TableCell className='text-right'>
              <FormattedDate date={feed.lastUpdatedAt} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
