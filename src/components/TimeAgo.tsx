'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, formatDistanceToNowStrict } from 'date-fns';
import locale from 'date-fns/locale/en-US';

const formatDistanceShort = {
  lessThanXSeconds: '{{count}}s',
  xSeconds: '{{count}}s',
  halfAMinute: '30s',
  lessThanXMinutes: '{{count}}m',
  xMinutes: '{{count}}m',
  aboutXHours: '{{count}}h',
  xHours: '{{count}}h',
  xDays: '{{count}}d',
  aboutXWeeks: '{{count}}w',
  xWeeks: '{{count}}w',
  aboutXMonths: '{{count}}m',
  xMonths: '{{count}}m',
  aboutXYears: '{{count}}y',
  xYears: '{{count}}y',
  overXYears: '{{count}}y',
  almostXYears: '{{count}}y',
} as const;

function formatDistance(
  token: keyof typeof formatDistanceShort,
  count: any,
  options: Parameters<typeof formatDistanceToNowStrict>[1] & { comparison?: number }
) {
  options = options || {};

  const result = formatDistanceShort[token].replace('{{count}}', count);

  if (options.addSuffix) {
    if (options.comparison! > 0) {
      return 'in ' + result;
    } else {
      return result + ' ago';
    }
  }

  return result;
}

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
          <>
            <span className='hidden sm:inline'>
              {formatDistanceToNowStrict(dateObj, { addSuffix: true })}
            </span>
            <span className='sm:hidden'>
              {formatDistanceToNowStrict(dateObj, {
                addSuffix: true,
                locale: {
                  ...locale,
                  formatDistance,
                },
              })}
            </span>
          </>
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
