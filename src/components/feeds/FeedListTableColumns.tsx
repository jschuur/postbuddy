'use client';

import { ColumnDef, RowData } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/ui/datatable/DataTableColumnHeader';

import TimeAgo from '@/components/TimeAgo';
import ErrorToolTip from '@/components/feeds/ErrorToolTip';
import FeedListRowActions from '@/components/feeds/FeedListRowActions';

import { type FeedWithDetails } from '@/db/queries';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    neverVisible?: boolean;
    startsHidden?: boolean;
    sortHeaderName?: string;
  }
}

export const columns: ColumnDef<FeedWithDetails>[] = [
  {
    accessorKey: 'siteUrl',
    meta: {
      neverVisible: true,
    },
  },
  {
    accessorKey: 'lastErrorMessage',
    meta: {
      neverVisible: true,
    },
  },
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title='ID' />,
    cell: ({ row }) => {
      return <div className='align-top'>{row.getValue('id')}</div>;
    },
    meta: {
      startsHidden: true,
      sortHeaderName: 'ID',
    },
  },
  {
    accessorKey: 'active',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Active' />,
    cell: ({ row }) => <div>{row.getValue('active') ? 'yes' : 'no'}</div>,
    meta: {
      startsHidden: true,
    },
  },

  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
    cell: ({ row }) => {
      return (
        <div className='align-top'>
          <span className='flex items-center'>
            <a href={row.getValue('siteUrl')}>{row.getValue('name')}</a>
            {row.getValue('errorCount') ? (
              <ErrorToolTip
                errorCount={row.getValue('errorCount')}
                lastErrorAt={row.getValue('lastErrorAt')}
                lastErrorMessage={row.getValue('lastErrorMessage')}
              />
            ) : (
              ''
            )}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'itemCount',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Items' />,
    cell: ({ row }) => {
      return <div>{row.getValue('itemCount')}</div>;
    },
    meta: {
      sortHeaderName: 'Item Count',
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
    meta: {
      startsHidden: true,
      sortHeaderName: 'Last Checked',
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
    meta: {
      sortHeaderName: 'Last Published',
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
    meta: {
      startsHidden: true,
      sortHeaderName: 'Last Error',
    },
  },
  {
    accessorKey: 'errorCount',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Errors' />,
    cell: ({ row }) => {
      return <div>{row.getValue('errorCount')}</div>;
    },
    meta: {
      startsHidden: true,
      sortHeaderName: 'Error Count',
    },
  },
  {
    accessorKey: 'errorsResetAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Errors Reset At' />,
    cell: ({ row }) => {
      return (
        <div className='text-left'>
          <TimeAgo date={row.getValue('errorsResetAt')} toolTip />
        </div>
      );
    },
    meta: {
      startsHidden: true,
      sortHeaderName: 'Errors Reset',
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Created At' />,
    cell: ({ row }) => {
      return (
        <div className='text-left'>
          <TimeAgo date={row.getValue('createdAt')} toolTip />
        </div>
      );
    },
    meta: {
      startsHidden: true,
      sortHeaderName: 'Created',
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Updated At' />,
    cell: ({ row }) => {
      return (
        <div className='text-left'>
          <TimeAgo date={row.getValue('updatedAt')} toolTip />
        </div>
      );
    },
    meta: {
      startsHidden: true,
      sortHeaderName: 'Updated',
    },
  },
  {
    accessorKey: 'action',
    header: '',
    cell: ({ row }) => {
      return <FeedListRowActions id={row.getValue('id')} />;
    },
  },
];
