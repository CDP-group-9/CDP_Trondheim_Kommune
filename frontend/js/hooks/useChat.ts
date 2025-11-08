import { useState, useEffect, useRef } from "react";

import { useAppState } from "../contexts/AppStateContext";
import { ChatService, ChatServiceError } from "../services";
import { ChatMessage } from "../types/ChatMessage";

import { useCookie } from "./useCookie";

export function useChat(apiUrl: string) {
  const { currentChatId, loadChatMessages, saveChatMessages } = useAppState();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  const isLoadingRef = useRef(false);
  const requestChatIdRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastLoadedChatIdRef = useRef<string | null>(null);

  const csrftoken = useCookie("csrftoken");

  useEffect(() => {
    if (currentChatId === lastLoadedChatIdRef.current) {
      setIsReady(true);
      return;
    }

    setIsReady(false);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (!currentChatId) {
      setMessages([]);
      setErrorMsg(null);
      setInputValue("");
      setIsSending(false);
      lastLoadedChatIdRef.current = null;
      setIsReady(true);
      return;
    }

    const chatIdToLoad = currentChatId;
    lastLoadedChatIdRef.current = chatIdToLoad;

    const loadMessages = async () => {
      isLoadingRef.current = true;
      const loadedMessages = await loadChatMessages(chatIdToLoad);

      if (currentChatId === chatIdToLoad) {
        isLoadingRef.current = false;
        setMessages(loadedMessages);
        setErrorMsg(null);
        setInputValue("");
        setIsSending(false);
        setIsReady(true);
      } else {
        isLoadingRef.current = false;
      }
    };

    loadMessages();
  }, [currentChatId, loadChatMessages]);

  useEffect(() => {
    if (!currentChatId || messages.length === 0 || isLoadingRef.current) {
      return;
    }

    saveChatMessages(currentChatId, messages);
  }, [currentChatId, messages, saveChatMessages]);

  const sendMessage = async (prompt: string, context?: string) => {
    if (!prompt.trim() || isSending || !currentChatId) return;

    const chatIdForThisRequest = currentChatId;
    requestChatIdRef.current = chatIdForThisRequest;

    setIsSending(true);
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      message: prompt,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    if (currentChatId) {
      await saveChatMessages(currentChatId, newMessages);
    }

    setInputValue("");
    setErrorMsg(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    let systemInstructions: string | undefined;
    try {
      const stored = localStorage.getItem("isInternal");
      const isInternal = stored ? JSON.parse(stored) : false;

      if (isInternal) {
        systemInstructions =
          "You are a law assistant. Answer the questions based on Norwegian law and as concise as possible, but provide examples. Treat the question as if it comes from an internal Trondheim kommune employee. If given additional context that are laws, refer to them when relevant. No more than 250 words. Answer in Norwegian.";
      }
    } catch (error) {
      console.error(error);
    }

    try {
      const chatService = ChatService.getInstance(apiUrl);

      const maxHistory = 8;
      const historyPayload = newMessages
        .slice(-maxHistory)
        .map(({ type, message }) => ({ type, message }));

      const response = await chatService.sendMessage(
        {
          prompt,
          history: historyPayload,
          // eslint-disable-next-line camelcase
          context_text: context || "",
          ...(systemInstructions && {
            // eslint-disable-next-line camelcase
            system_instructions: systemInstructions,
          }),
        },
        {
          signal: controller.signal,
          csrfToken: csrftoken || undefined,
        },
      );

      if (currentChatId !== chatIdForThisRequest) {
        console.log("Chat switched during request, discarding response");
        return;
      }

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        type: "bot",
        message: response,
      };
      setMessages((prev) => {
        const updated = [...prev, botMessage];
        if (currentChatId === chatIdForThisRequest) {
          saveChatMessages(chatIdForThisRequest, updated);
        }
        return updated;
      });
    } catch (error) {
      if (error instanceof ChatServiceError) {
        if (error.code === "ABORTED") {
          console.log("Request aborted due to chat switch");
          return;
        }
        setErrorMsg(error.message);
      } else {
        setErrorMsg("An unexpected error occurred");
      }
    } finally {
      if (currentChatId === chatIdForThisRequest) {
        setIsSending(false);
      }
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  };

  return {
    messages,
    errorMsg,
    inputValue,
    setInputValue,
    isSending,
    isReady,
    sendMessage,
  };
}
