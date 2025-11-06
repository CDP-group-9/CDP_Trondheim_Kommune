import { useEffect, useState } from "react";

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
} from "../ui/alert-dialog";

export function DssExternalVsInternal({
  autoOpen = false,

  onClose,
}: {
  autoOpen?: boolean;

  onClose?: () => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (autoOpen) setOpen(true);
  }, [autoOpen]);

  const handleClose = () => {
    setOpen(false);

    if (onClose) onClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {!autoOpen && <AlertDialogTrigger>Open</AlertDialogTrigger>}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Jobber du i Trondheim kommune?</AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogDescription>
          For å kunne gi best mulig anbefaling må verktøyet vite om du jobber i
          Trondheim kommune eller ikke.
        </AlertDialogDescription>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>
            Jobber i Trondheim kommune
          </AlertDialogCancel>

          <AlertDialogAction onClick={handleClose}>
            Jobber IKKE i Trondheim kommune
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
