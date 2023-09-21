import { Table } from '@tanstack/react-table';
import { ChevronUp, Tally4 } from 'lucide-react';
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DataTableColumnSelectProps<TData> {
  table: Table<TData>;
}

export default function DataTableColumnSelect<TData>({ table }: DataTableColumnSelectProps<TData>) {
  const [drownOpen, setDropdownOpen] = useState(false);
  useHotkeys(
    'c',
    () => {
      setDropdownOpen(true);
    },
    { preventDefault: true }
  );

  return (
    <DropdownMenu open={drownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='gap-1 [&[data-state=open]>svg]:rotate-180'>
          <span className='hidden sm:inline'>Columns</span>
          <Tally4 className='h-4 w-4 sm:hidden' />
          <ChevronUp
            className={`hidden sm:inline h-4 w-4 ml-2 transition-transform duration-400`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {table
          .getAllColumns()
          .filter(
            (column) =>
              column.getCanHide() &&
              (!column.columnDef?.meta?.neverVisible || column.columnDef?.meta?.alwaysVisible)
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className='capitalize'
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.columnDef?.meta?.sortHeaderName || column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
