import { Send } from "lucide-react";
import { useState } from "react";

import { FourButtons } from "../components/ui/app-four-buttons";
import { Button } from "../components/ui/button";
import { ChatBox } from "../components/ui/chatbox";
import { Textarea } from "../components/ui/textarea";

interface ChatMessage {
  id: string;
  type: "user" | "bot";
  message: string;
}

const Home = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(";").shift();
    return "";
  }

  async function handleChatSubmit(prompt: string) {
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
      const response = await fetch("http://localhost:8000/api/chat/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFTOKEN": getCookie("csrftoken") || "",
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
    } catch (error) {
      setErrorMsg("No connection to server.");
    }
  }

  return (
    <div className="h-full flex flex-col">
      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-lg mx-auto">
            <FourButtons submitPromptFunction={handleChatSubmit} />
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <ChatBox key={msg.id} message={msg.message} type={msg.type} />
          ))}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-600 text-center">{errorMsg}</div>
      )}
      <div className="border-t border-gray-300 bg-background p-4">
        <div className="mx-auto flex gap-2">
          <Textarea
            className="flex-1 min-h-8"
            id="user-input"
            placeholder="Spør om GDPR, DPIA eller personvernspørsmål..."
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button
            aria-label="Submit"
            disabled={!inputValue.trim()}
            size="icon"
            onClick={() => handleChatSubmit(inputValue)}
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
