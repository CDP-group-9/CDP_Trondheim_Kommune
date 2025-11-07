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
  onSelect,
}: {
  autoOpen?: boolean;
  onClose?: () => void;
  onSelect?: (isInternal: boolean) => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (autoOpen) setOpen(true);
  }, [autoOpen]);

  const handleSelect = (value: boolean) => {
    localStorage.setItem("isInternal", JSON.stringify(value));
    window.dispatchEvent(
      new CustomEvent("internalStatusChanged", { detail: value }),
    );

    if (onSelect) onSelect(value);
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
          <AlertDialogCancel onClick={() => handleSelect(true)}>
            Jeg jobber i Trondheim kommune
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleSelect(false)}>
            Jeg jobber IKKE i Trondheim kommune
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
