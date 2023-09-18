import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type Props = {
  children: React.ReactNode;
  description: string | JSX.Element;
  title: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  closeMenu?: () => void;
  cancel?: string;
  confirm?: string;
};

export default function ConfirmationAlert({
  children,
  description,
  title,
  onCancel,
  onConfirm,
  closeMenu,
  cancel,
  confirm,
}: Props) {
  const [alertOpen, setAlertOpen] = useState(false);

  const handleClick = (action?: () => void) => {
    if (closeMenu) closeMenu();
    if (action) action();
  };

  return (
    <AlertDialog
      open={alertOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen && closeMenu) closeMenu();

        setAlertOpen(isOpen);
      }}
    >
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => handleClick(onCancel)}>
            {cancel || 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction variant={'destructive'} onClick={() => handleClick(onConfirm)}>
            {confirm || 'Continue'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
