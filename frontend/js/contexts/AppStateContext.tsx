import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { useCookie } from "js/hooks/useCookie";
import { ChecklistService } from "services";
import type { ChatMessage } from "types/ChatMessage";
import type { ChecklistPayload } from "types/Checklist";
import { storage, ChatSession, ChecklistSession } from "utils/storage";

interface AppState {
  // Chat state
  currentChatId: string | null;
  chatSessions: ChatSession[];

  // Checklist state
  currentChecklistId: string | null;

  // Chat actions
  createNewChat: (checklistId?: string) => Promise<string>;
  switchToChat: (chatId: string) => void;
  saveChatMessages: (chatId: string, messages: ChatMessage[]) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  loadChatMessages: (chatId: string) => Promise<ChatMessage[]>;
  getChatChecklistId: (chatId: string) => string | null;

  // Checklist actions
  createNewChecklist: () => void;
  switchToChecklist: (checklistId: string) => void;
  restoreCurrentChecklist: () => void;
  saveCurrentChecklist: (
    data: ChecklistPayload,
    title?: string,
  ) => Promise<void>;
  deleteChecklist: (checklistId: string) => Promise<void>;
  getCurrentChecklistData: () => Promise<ChecklistPayload | null>;
  createChatFromChecklist: () => Promise<string>;
  getChecklistContext: (chatId: string) => Promise<string | null>;

  // Loading state
  isLoading: boolean;
}

const AppStateContext = createContext<AppState | null>(null);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChecklistId, setCurrentChecklistId] = useState<string | null>(
    null,
  );
  const [pendingChecklistId, setPendingChecklistId] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const csrftoken = useCookie("csrftoken");

  useEffect(() => {
    const loadData = async () => {
      try {
        await storage.init();

        const allChats = await storage.getAllChatSessions();
        const chatsWithMessages = allChats.filter((c) => c.messages.length > 0);
        setChatSessions(chatsWithMessages);

        const savedChecklistId = localStorage.getItem("currentChecklistId");
        if (savedChecklistId) {
          const existingChecklist =
            await storage.getChecklistSession(savedChecklistId);
          if (existingChecklist) {
            setCurrentChecklistId(savedChecklistId);
          } else {
            const newChecklistId = `checklist-${Date.now()}`;
            const newSession: ChecklistSession = {
              id: newChecklistId,
              title: "Ny sjekkliste",
              data: {},
              createdAt: Date.now(),
              updatedAt: Date.now(),
            };
            await storage.saveChecklistSession(newSession);
            setCurrentChecklistId(newChecklistId);
            localStorage.setItem("currentChecklistId", newChecklistId);
          }
        } else {
          const newChecklistId = `checklist-${Date.now()}`;
          const newSession: ChecklistSession = {
            id: newChecklistId,
            title: "Ny sjekkliste",
            data: {},
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          await storage.saveChecklistSession(newSession);
          setCurrentChecklistId(newChecklistId);
          localStorage.setItem("currentChecklistId", newChecklistId);
        }
      } catch (error) {
        console.error("Storage init error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const createNewChat = useCallback(
    async (checklistId?: string): Promise<string> => {
      const newChatId = `chat-${Date.now()}`;
      if (checklistId) {
        setPendingChecklistId(checklistId);
      }
      setCurrentChatId(newChatId);

      return newChatId;
    },
    [],
  );

  const switchToChat = useCallback((chatId: string) => {
    setCurrentChatId(chatId);
  }, []);

  const loadChatMessages = useCallback(
    async (chatId: string): Promise<ChatMessage[]> => {
      const session = await storage.getChatSession(chatId);
      return session?.messages || [];
    },
    [],
  );

  const saveChatMessages = useCallback(
    async (chatId: string, messages: ChatMessage[]) => {
      let session = await storage.getChatSession(chatId);

      if (!session) {
        session = {
          id: chatId,
          title: "Ny samtale",
          messages: [],
          checklistId: pendingChecklistId || undefined,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        setPendingChecklistId(null);
      }

      let { title } = session;
      if (title === "Ny samtale" && messages.length > 0) {
        const firstUserMsg = messages.find((m) => m.type === "user");
        if (firstUserMsg) {
          title =
            firstUserMsg.message.slice(0, 50) +
            (firstUserMsg.message.length > 50 ? "..." : "");
        }
      }

      const updatedSession: ChatSession = {
        ...session,
        messages,
        title,
        updatedAt: Date.now(),
      };

      await storage.saveChatSession(updatedSession);

      if (messages.length > 0) {
        setChatSessions((prev) => {
          const filtered = prev.filter((c) => c.id !== chatId);
          return [updatedSession, ...filtered];
        });
      }
    },
    [pendingChecklistId],
  );

  const deleteChat = useCallback(
    async (chatId: string) => {
      await storage.deleteChatSession(chatId);
      setChatSessions((prev) => prev.filter((c) => c.id !== chatId));

      if (currentChatId === chatId) {
        setCurrentChatId(null);
      }
    },
    [currentChatId],
  );

  const createNewChecklist = useCallback(async () => {
    const newChecklistId = `checklist-${Date.now()}`;
    const newSession: ChecklistSession = {
      id: newChecklistId,
      title: "Ny sjekkliste",
      data: {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await storage.saveChecklistSession(newSession);
    setCurrentChecklistId(newChecklistId);
    localStorage.setItem("currentChecklistId", newChecklistId);
  }, []);

  const switchToChecklist = useCallback((checklistId: string) => {
    setCurrentChecklistId(checklistId);
  }, []);

  const restoreCurrentChecklist = useCallback(() => {
    // Restore the persistent current checklist from localStorage
    const savedChecklistId = localStorage.getItem("currentChecklistId");
    if (savedChecklistId) {
      setCurrentChecklistId(savedChecklistId);
    }
  }, []);

  const getCurrentChecklistData =
    useCallback(async (): Promise<ChecklistPayload | null> => {
      if (!currentChecklistId) return null;
      const session = await storage.getChecklistSession(currentChecklistId);
      return session?.data || null;
    }, [currentChecklistId]);

  const saveCurrentChecklist = useCallback(
    async (data: ChecklistPayload, title?: string) => {
      if (!currentChecklistId) return;

      const existing = await storage.getChecklistSession(currentChecklistId);

      const updatedSession: ChecklistSession = {
        id: currentChecklistId,
        title: title || existing?.title || "Ny sjekkliste",
        data,
        chatId: existing?.chatId,
        createdAt: existing?.createdAt || Date.now(),
        updatedAt: Date.now(),
      };

      await storage.saveChecklistSession(updatedSession);
    },
    [currentChecklistId],
  );

  const deleteChecklist = useCallback(
    async (checklistId: string) => {
      await storage.deleteChecklistSession(checklistId);

      if (currentChecklistId === checklistId) {
        setCurrentChecklistId(null);
      }
    },
    [currentChecklistId],
  );

  const createChatFromChecklist = useCallback(async (): Promise<string> => {
    if (!currentChecklistId) {
      throw new Error("No active checklist");
    }

    const checklistSession =
      await storage.getChecklistSession(currentChecklistId);
    if (!checklistSession) {
      throw new Error("Checklist not found");
    }

    if (checklistSession.chatId) {
      setCurrentChatId(checklistSession.chatId);
      return checklistSession.chatId;
    }

    const newChatId = `chat-${Date.now()}`;
    const newChatSession: ChatSession = {
      id: newChatId,
      title: checklistSession.title || "Personvernveiledning",
      messages: [],
      checklistId: currentChecklistId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const updatedChecklistSession: ChecklistSession = {
      ...checklistSession,
      chatId: newChatId,
      updatedAt: Date.now(),
    };

    await storage.saveChatSession(newChatSession);
    await storage.saveChecklistSession(updatedChecklistSession);

    setCurrentChatId(newChatId);

    localStorage.setItem("shouldSendChecklistMessage", "true");

    return newChatId;
  }, [currentChecklistId]);

  const getChatChecklistId = useCallback(
    (chatId: string): string | null => {
      const session = chatSessions.find((s) => s.id === chatId);
      return session?.checklistId || null;
    },
    [chatSessions],
  );

  const getChecklistContext = useCallback(
    async (chatId: string): Promise<string | null> => {
      // Prefer reading the chat session directly from storage (works for new/empty chats)
      const chatSession = await storage.getChatSession(chatId);
      const checklistId =
        chatSession?.checklistId || getChatChecklistId(chatId);
      if (!checklistId) return null;

      try {
        const checklistSession = await storage.getChecklistSession(checklistId);
        if (!checklistSession?.data) return null;

        const checklistService = ChecklistService.getInstance();
        return await checklistService.convertToString(checklistSession.data, {
          csrfToken: csrftoken || undefined,
        });
      } catch (error) {
        console.error("Failed to get checklist context:", error);
        return null;
      }
    },
    [getChatChecklistId, csrftoken],
  );

  return (
    <AppStateContext.Provider
      value={{
        currentChatId,
        chatSessions,
        currentChecklistId,
        createNewChat,
        switchToChat,
        loadChatMessages,
        saveChatMessages,
        deleteChat,
        getChatChecklistId,
        createNewChecklist,
        switchToChecklist,
        saveCurrentChecklist,
        restoreCurrentChecklist,
        deleteChecklist,
        getCurrentChecklistData,
        createChatFromChecklist,
        getChecklistContext,
        isLoading,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return context;
};
