import { Table } from '@tanstack/react-table';
import { ChevronUp } from 'lucide-react';
import { useState } from 'react';

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
  const [, setDropdownOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='gap-1 [&[data-state=open]>svg]:rotate-180'>
          Columns
          <ChevronUp className={`h-4 w-4 ml-2 transition-transform duration-400`} />
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
