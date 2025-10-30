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
    <div className="border-b border-brand-gray bg-muted/30 px-4 py-2">
      <div className="flex items-center gap-2 text-sm">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">
          Denne samtalen er koblet til en sjekkliste
        </span>
        <Button
          asChild
          className="ml-auto"
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
