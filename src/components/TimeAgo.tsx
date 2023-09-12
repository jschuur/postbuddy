'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, formatDistanceToNowStrict } from 'date-fns';

export default function LastSeen({ date }: { date: Date | string | null }) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (!dateObj) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{formatDistanceToNowStrict(dateObj, { addSuffix: true })}</span>
        </TooltipTrigger>
        <TooltipContent className='bg-zinc-50'>
          <p className='text-xs'>
            <div>{format(dateObj, 'PPPP')}</div>
            <div>at {format(dateObj, 'pppp')}</div>
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
