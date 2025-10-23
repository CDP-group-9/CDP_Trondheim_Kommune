import { useState } from "react";

import { ChatMessage } from "../types/ChatMessage";

import { useCookie } from "./useCookie";

export function useChat(apiUrl: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);

  const csrftoken = useCookie("csrftoken");

  const sendMessage = async (prompt: string, context?: string) => {
    /* Prevent sending empty messages */
    if (!prompt.trim() || isSending) return;

    setIsSending(true);
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      message: prompt,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setErrorMsg(null);
    const contextToUse =
      context || localStorage.getItem("checklistContext") || "";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFTOKEN": csrftoken || "",
        },
        credentials: "include",
        body: JSON.stringify({
          prompt,
          history: [],
          context_text: contextToUse,
        }),
      });
      const data: { response?: string; error?: string } = await response.json();
      if (response.ok && data.response !== undefined) {
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          type: "bot",
          message: data.response,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        setErrorMsg(data.error || "Unknown error");
      }
    } catch {
      setErrorMsg("No connection to server.");
    } finally {
      setIsSending(false);
    }
  };

  return {
    messages,
    errorMsg,
    inputValue,
    setInputValue,
    isSending,
    sendMessage,
  };
}
