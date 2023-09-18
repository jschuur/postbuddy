'use client';

import { MoreVertical } from 'lucide-react';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import DeleteFeedRowAction from '@/components/feeds/DeleteFeedRowAction';
import FeedSheet from '@/components/feeds/FeedSheet';

import useFeed from '@/hooks/useFeed';
import useUpdateFeed from '@/hooks/useUpdateFeed';

interface Props {
  id: number;
}

export default function FeedListRowActions({ id }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const [feed] = useFeed(id);
  const { mutate: updateFeedMutation } = useUpdateFeed();

  const closeMenu = () => setMenuOpen(false);

  const toggleFeedActive = () => {
    closeMenu();
    updateFeedMutation({
      feed,
      values: { active: !feed.active },
      successMsg: (
        <>
          <span className='font-medium'>{feed.name}</span> {feed.active ? 'paused' : 'enabled'}
        </>
      ),
    });
  };

  const clearError = () => {
    closeMenu();

    updateFeedMutation({
      feed,
      values: { errorCount: 0, lastErrorAt: null, lastErrorMessage: null },
      successMsg: (
        <>
          Errors cleared for <span className='font-medium'>{feed.name}</span>
        </>
      ),
    });
  };

  const visitFeedUrl = (url: string | null) => {
    closeMenu();

    if (url) window.open(url, '_blank');
  };

  if (!feed) return null;

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <MoreVertical tabIndex={0} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>{feed.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <FeedSheet id={id} closeMenu={closeMenu}>
            <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
              Edit feed
            </DropdownMenuItem>
          </FeedSheet>
          <DropdownMenuItem onSelect={toggleFeedActive}>
            {feed.active ? 'Pause' : 'Enable'} feed
          </DropdownMenuItem>
          <DropdownMenuItem disabled={feed.lastErrorAt === null} onSelect={clearError}>
            Clear error
          </DropdownMenuItem>
          <DeleteFeedRowAction feed={feed} closeMenu={closeMenu}>
            <DropdownMenuItem
              onSelect={(event) => {
                return event.preventDefault();
              }}
            >
              <span className='text-red-600'>Delete feed</span>
            </DropdownMenuItem>
          </DeleteFeedRowAction>
          <DropdownMenuSeparator />
          {feed.url ? (
            <DropdownMenuItem onSelect={() => visitFeedUrl(feed.url)}>
              Visit feed URL
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem className='cursor-not-allowed text-muted-foreground'>
              no feed URL
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
