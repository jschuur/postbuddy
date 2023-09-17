'use client';

import { MoreHorizontal } from 'lucide-react';
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
import { useToast } from '@/components/ui/use-toast';

import FeedSheet from '@/components/feeds/FeedSheet';

import useFeed from '@/hooks/useFeed';

interface Props {
  id: number;
}

export default function FeedListRowActions({ id }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { toast } = useToast();
  const [feed] = useFeed(id);

  const closeMenu = () => setMenuOpen(false);

  const pauseFeed = () => {
    closeMenu();

    toast({
      title: 'Feed paused',
      description: 'TBD',
    });
  };

  const clearError = () => {
    closeMenu();

    toast({
      title: 'Clear error',
      description: 'TBD',
    });
  };

  const visitFeedUrl = (url: string | null) => {
    closeMenu();

    if (url) window.open(url, '_blank');
  };

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <MoreHorizontal tabIndex={0} />
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
          <DropdownMenuItem onSelect={pauseFeed}>Pause feed</DropdownMenuItem>
          <DropdownMenuItem onSelect={clearError}>Clear error</DropdownMenuItem>
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
