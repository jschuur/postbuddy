'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/ui/datatable/DataTableColumnHeader';

import TimeAgo from '@/components/TimeAgo';
import FeedListRowActions from '@/components/feeds/FeedListRowActions';

export type FeedList = {
  name: string | null;
  itemCount: number | null;
  active: boolean | null;
  siteUrl: string | null;
  lastCheckedAt: Date | null;
  lastPublishedAt: Date | null;
  lastErrorAt: Date | null;
  lastErrorMessage: string | null;
};

export const columns: ColumnDef<FeedList>[] = [
  {
    accessorKey: 'active',
  },
  {
    accessorKey: 'siteUrl',
  },
  {
    accessorKey: 'lastErrorMessage',
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
    cell: ({ row }) => {
      return (
        <div className='align-top'>
          <a href={row.getValue('siteUrl')}>{row.getValue('name')}</a>
        </div>
      );
    },
  },
  {
    accessorKey: 'itemCount',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Items' />,
    cell: ({ row }) => {
      return <div className='text-center'>{row.getValue('itemCount')}</div>;
    },
  },
  {
    accessorKey: 'lastCheckedAt',
    header: ({ column }) => (
      <DataTableColumnHeader className='' column={column} title='Last Checked' />
    ),
    cell: ({ row }) => {
      return (
        <div className='text-left'>
          <TimeAgo date={row.getValue('lastCheckedAt')} />
        </div>
      );
    },
  },
  {
    accessorKey: 'lastPublishedAt',
    header: ({ column }) => (
      <DataTableColumnHeader className='' column={column} title='Last Published' />
    ),
    cell: ({ row }) => {
      return (
        <div className='text-left'>
          <TimeAgo date={row.getValue('lastPublishedAt')} toolTip />
        </div>
      );
    },
  },
  {
    accessorKey: 'lastErrorAt',
    header: ({ column }) => (
      <DataTableColumnHeader className='' column={column} title='Last Error' />
    ),
    cell: ({ row }) => {
      const lastErrorMessage = row.getValue<string>('lastErrorMessage');
      const lastErrorAt = row.getValue<Date>('lastErrorAt');

      return (
        <div className='align-top'>
          {lastErrorAt && (
            <div className='pb-2'>
              <TimeAgo date={lastErrorAt} />
            </div>
          )}
          {lastErrorMessage && (
            <div className='text-xs font-light text-slate-500'>{lastErrorMessage}</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'action',
    header: '',
    cell: ({ row }) => {
      return <FeedListRowActions name={row.getValue('name')} />;
    },
  },
];
