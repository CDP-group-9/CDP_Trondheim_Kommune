import { useState, useEffect, useRef } from "react";

import { useAppState } from "../contexts/AppStateContext";
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

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFTOKEN": csrftoken || "",
        },
        credentials: "include",
        signal: controller.signal,
        body: JSON.stringify({
          prompt,
          history: [],
          // eslint-disable-next-line camelcase
          context_text: context || "",
        }),
      });

      const data: { response?: string; error?: string } = await response.json();

      if (currentChatId !== chatIdForThisRequest) {
        console.log("Chat switched during request, discarding response");
        return;
      }

      if (response.ok && data.response !== undefined) {
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          type: "bot",
          message: data.response,
        };
        setMessages((prev) => {
          const updated = [...prev, botMessage];
          if (currentChatId === chatIdForThisRequest) {
            saveChatMessages(chatIdForThisRequest, updated);
          }
          return updated;
        });
      } else {
        setErrorMsg(data.error || "Unknown error");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request aborted due to chat switch");
        return;
      }
      setErrorMsg("No connection to server.");
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
