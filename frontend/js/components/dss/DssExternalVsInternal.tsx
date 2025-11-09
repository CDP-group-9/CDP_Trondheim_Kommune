import { useEffect, useId, useState } from "react";

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
  const titleId = useId();
  const descriptionId = useId();

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
      {!autoOpen && (
        <AlertDialogTrigger aria-label="Velg om du jobber i Trondheim kommune">
          Velg internstatus
        </AlertDialogTrigger>
      )}
      <AlertDialogContent
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        role="alertdialog"
      >
        <AlertDialogHeader>
          <AlertDialogTitle id={titleId}>
            Jobber du i Trondheim kommune?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="text-base" id={descriptionId}>
          For å kunne gi best mulig anbefaling må verktøyet vite om du er ansatt
          i Trondheim kommune eller ikke.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => handleSelect(true)}>
            Ansatt i Trondheim kommune
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleSelect(false)}>
            Ikke ansatt i Trondheim kommune
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
