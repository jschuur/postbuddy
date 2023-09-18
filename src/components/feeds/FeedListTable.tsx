'use client';

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import DataTablePagination from '@/components/ui/datatable/DataTablePagination';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import AddFeed from '@/components/feeds/AddFeed';
import { columns } from '@/components/feeds/FeedListTableColumns';

import useFeedList from '@/hooks/useFeedList';
import { cn } from '@/lib/utils';

export default function FeedListTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [data] = useFeedList();

  const [columnVisibility] = useState<VisibilityState>({
    siteUrl: false,
    lastCheckedAt: false,
    lastErrorMessage: false,
    active: false,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnVisibility,
      columnFilters,
    },
  });

  const totalFeedCount = data.length;
  const currentFeedCount = table.getRowModel().rows.length;
  const disabledFeedCount = table.getRowModel().rows.filter((f) => !f.getValue('active')).length;

  return (
    <div>
      <div className='flex items-center py-4'>
        <Input
          placeholder='Filter feeds...'
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
          className='max-w-sm'
        />
        <AddFeed />
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableCaption className='text-sm mb-2'>
            Total feeds: {totalFeedCount}
            {totalFeedCount !== currentFeedCount ? `, ${currentFeedCount} listed` : ''}
            {disabledFeedCount ? `, ${disabledFeedCount} disabled` : ''}
          </TableCaption>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className='bg-slate-100'>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(['align-top', row.getValue('active') ? '' : 'text-slate-300'])}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow onClick={() => console.log('click')}>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='py-6'>
        <DataTablePagination table={table} selectCount={false} />
      </div>
    </div>
  );
}
