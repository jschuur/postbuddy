'use client';

import { cn } from '@/lib/utils';

import { DEFAULT_ITEM_ENCLOSURE_WIDTH } from '@/config';

import CDNImage from '@/components/CDNImage';
import FormattedDate from '@/components/FormattedDate';

import { FeedEntrySelect, FeedSelect } from '@/db/schema';

const visit = (url: string) => {
  window.location.href = url;
};

export default function FeedEntry({ entry, feed }: { entry: FeedEntrySelect; feed: FeedSelect }) {
  return (
    <>
      <div className='col-span-2 border-b-[1px] border-gray-500'>
        <a href={entry.url || '#'}>{entry.title}</a>
        <p className='text-xs font-light text-gray-400'>
          <FormattedDate date={entry.publishedAt} />,{' '}
          <a href={feed.siteUrl || feed.url || '#'}>{feed.name}</a>
        </p>
      </div>
      <div
        onClick={() => visit(entry.url || '#')}
        className={cn('hover:cursor-pointer pt-2', entry.enclosureUrl ? '' : 'col-span-2')}
      >
        <p className='font-light text-sm pb-4'>{entry.description}</p>
      </div>
      {entry.enclosureUrl && (
        <div
          onClick={() => visit(entry.url || '#')}
          className='hover:cursor-pointer pl-8 justify-self-end pb-4'
        >
          <CDNImage
            src={entry.enclosureUrl}
            width={DEFAULT_ITEM_ENCLOSURE_WIDTH}
            alt={`Article preview image for '${entry.title}'`}
          />
        </div>
      )}
    </>
  );
}
