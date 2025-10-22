import { useState } from "react";

import { ChatMessage } from "../types/ChatMessage";

import { useCookie } from "./useCookie";

export function useChat(apiUrl: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  const csrftoken = useCookie("csrftoken");

  const sendMessage = async (prompt: string) => {
    /* Prevent sending empty messages */
    if (!prompt.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      message: prompt,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setErrorMsg(null);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFTOKEN": csrftoken || "",
        },
        credentials: "include",
        body: JSON.stringify({ prompt, history: [] }),
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
    }
  };

  return { messages, errorMsg, inputValue, setInputValue, sendMessage };
}
