'use client';

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import DataTableColumnSelect from '@/components/ui/datatable/DataTableColumnSelect';
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

  const initialVisibilityState: Record<string, boolean> = {};

  columns.forEach((column) => {
    // @ts-ignore
    if ((column?.meta?.startsHidden || column.meta?.neverVisible) && column?.accessorKey) {
      // @ts-ignore
      initialVisibilityState[column.accessorKey] = false;
    }
  });

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialVisibilityState);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
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
      <div className='flex items-center py-4 gap-2'>
        <div className='grow'>
          <Input
            placeholder='Filter feeds...'
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
        </div>
        <DataTableColumnSelect table={table} />
        <AddFeed />
      </div>
      <div className='rounded-md border'>
        <Table className='text-xs sm:text-sm'>
          <TableCaption className='text-xs mb-2'>
            Total feeds: {totalFeedCount}
            {totalFeedCount !== currentFeedCount ? `, ${currentFeedCount} listed` : ''}
            {disabledFeedCount ? `, ${disabledFeedCount} disabled` : ''}
          </TableCaption>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn([
                        'bg-slate-100',
                        header.column.columnDef.meta?.className,
                        header.column.columnDef.meta?.classNameHead,
                      ])}
                    >
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
                      className={cn([
                        'align-top p-2 sm:p-4',
                        row.getValue('active') ? '' : 'text-slate-300',
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.classNameCell,
                      ])}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
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
