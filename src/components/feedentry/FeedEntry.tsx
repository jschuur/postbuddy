'use client';

import Image from 'next/image';

import { cn } from '@/lib/utils';

import FormattedDate from '@/components/FormattedDate';

import { FeedEntrySelect, FeedSelect } from '@/db/schema';
const visit = (url: string) => {
  window.location.href = url;
};

export default function FeedEntry({ entry, feed }: { entry: FeedEntrySelect; feed: FeedSelect }) {
  return (
    <>
      <div className='col-span-2 pb-1'>
        <a href={entry.url || '#'}>{entry.title}</a>
        <p className='text-xs font-light text-gray-400'>
          <FormattedDate date={entry.publishedAt} />,{' '}
          <a href={feed.siteUrl || feed.url || '#'}>{feed.name}</a>
        </p>
      </div>
      <div
        onClick={() => visit(entry.url || '#')}
        className={cn('hover:cursor-pointer', entry.enclosureUrl ? '' : 'col-span-2')}
      >
        <p className='font-light text-sm pb-4'>{entry.description}</p>
      </div>
      {entry.enclosureUrl && (
        <div
          onClick={() => visit(entry.url || '#')}
          className='hover:cursor-pointer pl-8 justify-self-end pb-4'
        >
          <Image
            src={entry.enclosureUrl}
            alt={entry.description || entry.title || 'Feed entry image'}
            width='240'
            height='180'
            unoptimized
          />
        </div>
      )}
    </>
  );
}
