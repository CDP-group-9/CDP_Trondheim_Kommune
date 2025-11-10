import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppState } from "contexts/AppStateContext";

import { Button } from "../ui/button";

export function DssChecklistLink() {
  const navigate = useNavigate();
  const { currentChatId, switchToChecklist, getChatChecklistId } =
    useAppState();
  const [checklistId, setChecklistId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentChatId) {
      setChecklistId(null);
      return;
    }

    const linkedChecklistId = getChatChecklistId(currentChatId);
    setChecklistId(linkedChecklistId);
  }, [currentChatId, getChatChecklistId]);

  if (!checklistId) return null;

  return (
    <div className="w-full border-b border-border bg-muted/50 px-4 py-2.5 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 text-sm max-w-6xl mx-auto">
        <div className="flex items-center gap-2 min-w-0">
          <FileText
            aria-hidden="true"
            className="h-4 w-4 text-muted-foreground flex-shrink-0"
          />
          <span className="text-muted-foreground truncate">
            Denne samtalen er koblet til en sjekkliste
          </span>
        </div>
        <Button
          aria-label="Rediger sjekkliste tilknyttet denne samtalen"
          className="flex-shrink-0"
          size="sm"
          variant="outline"
          onClick={() => {
            switchToChecklist(checklistId);
            navigate("/sjekkliste");
          }}
        >
          <FileText aria-hidden="true" className="h-4 w-4 mr-2" />
          Rediger sjekkliste
        </Button>
      </div>
    </div>
  );
}
