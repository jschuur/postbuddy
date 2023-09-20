'use client';

import { formatDistanceToNowStrict } from 'date-fns';
import { AlertTriangle } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type Props = {
  errorCount: number;
  lastErrorAt: string;
  lastErrorMessage: string;
};

export default function ErrorToolTip({ errorCount, lastErrorAt, lastErrorMessage }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertTriangle className='h-4 w-4 text-red-500' />
        </TooltipTrigger>
        <TooltipContent className='bg-zinc-50'>
          <div className='text-xs'>
            <div>
              Last error (of {errorCount}):{' '}
              {formatDistanceToNowStrict(new Date(lastErrorAt), { addSuffix: true })}
            </div>
            <div className='pt-3 font-light text-slate-500'>{lastErrorMessage}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
