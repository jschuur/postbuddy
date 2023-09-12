'use client';

import { cn } from '@/lib/utils';

import { DEFAULT_ITEM_ENCLOSURE_WIDTH } from '@/config';

import CDNImage from '@/components/CDNImage';
import TimeAgo from '@/components/TimeAgo';

import { FeedItemSelect, FeedSelect } from '@/db/schema';

const visit = (url: string) => {
  window.location.href = url;
};

export default function FeedItem({ item, feed }: { item: FeedItemSelect; feed: FeedSelect }) {
  return (
    <>
      <div className='col-span-2 border-b-[1px] border-gray-500'>
        <a href={item.url || '#'}>{item.title}</a>
        <p className='text-xs font-light text-gray-400'>
          {item.publishedAt && (
            <>
              <TimeAgo date={item.publishedAt} />,{' '}
            </>
          )}
          <a href={feed.siteUrl || feed.url || '#'}>{feed.name}</a>
        </p>
      </div>
      <div
        onClick={() => visit(item.url || '#')}
        className={cn('hover:cursor-pointer pt-2', item.enclosureUrl ? '' : 'col-span-2')}
      >
        <p className='font-light text-sm pb-4'>{item.description}</p>
      </div>
      {item.enclosureUrl && (
        <div
          onClick={() => visit(item.url || '#')}
          className='hover:cursor-pointer pl-8 justify-self-end pb-4'
        >
          <CDNImage
            src={item.enclosureUrl}
            width={DEFAULT_ITEM_ENCLOSURE_WIDTH}
            alt={`Article preview image for '${item.title}'`}
          />
        </div>
      )}
    </>
  );
}
