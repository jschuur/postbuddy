'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, formatDistanceToNowStrict } from 'date-fns';

export default function TimeAgo({
  date,
  toolTip = false,
}: {
  date: Date | string | null;
  toolTip?: boolean;
}) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (!dateObj) return null;

  return toolTip ? (
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
  ) : (
    formatDistanceToNowStrict(dateObj, { addSuffix: true })
  );
}
