import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';

import FeedForm from '@/components/feeds/FeedForm';

import useFeed from '@/hooks/useFeed';

interface Props {
  id?: number;
  closeMenu?: () => void;
  children: React.ReactNode;
}

export default function FeedSheet({ id, closeMenu, children }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [feed] = useFeed(id);

  const closeSheet = () => setSheetOpen(false);

  return (
    <Sheet
      open={sheetOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen && closeMenu) closeMenu();

        setSheetOpen(isOpen);
      }}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className='sm:max-w-[425px]'>
        <SheetHeader>
          <SheetTitle>{feed?.id ? 'Edit' : 'Add'} feed</SheetTitle>
        </SheetHeader>
        <FeedForm feed={feed} closeMenu={closeMenu} closeSheet={closeSheet} />
        <SheetFooter></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}