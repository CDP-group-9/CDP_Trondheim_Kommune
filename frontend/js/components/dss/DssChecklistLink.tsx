import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAppState } from "../../contexts/AppStateContext";
import { storage } from "../../utils/storage";
import { Button } from "../ui/button";

export function DssChecklistLink() {
  const { currentChatId, switchToChecklist } = useAppState();
  const [checklistId, setChecklistId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentChatId) {
      setChecklistId(null);
      return;
    }

    const loadChecklistId = async () => {
      const session = await storage.getChatSession(currentChatId);
      setChecklistId(session?.checklistId || null);
    };

    loadChecklistId();
  }, [currentChatId]);

  if (!checklistId) return null;

  return (
    <div className="w-full border-b border-border bg-muted/50 px-4 py-2.5 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 text-sm max-w-6xl mx-auto">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-muted-foreground truncate">
            Denne samtalen er koblet til en sjekkliste
          </span>
        </div>
        <Button
          asChild
          className="flex-shrink-0"
          size="sm"
          variant="outline"
          onClick={() => switchToChecklist(checklistId)}
        >
          <Link to="/sjekkliste">
            <FileText className="h-4 w-4 mr-2" />
            Rediger sjekkliste
          </Link>
        </Button>
      </div>
    </div>
  );
}
