import { Send } from "lucide-react";

import { useChat } from "js/hooks/useChat";

import { FourButtons } from "../components/tk/app-four-buttons";
import { ChatBox } from "../components/tk/chatbox";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { ChatMessage } from "../types/ChatMessage";

const Home = () => {
  const { messages, errorMsg, inputValue, setInputValue, sendMessage } =
    useChat("http://localhost:8000/api/chat/chat/");

  return (
    <div className="h-full w-full flex flex-col">
      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-lg mx-auto">
            <FourButtons submitPromptFunction={sendMessage} />
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg: ChatMessage) => (
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
            onChange={(event) => setInputValue(event.target.value)}
          />
          <Button
            aria-label="Submit"
            disabled={!inputValue.trim()}
            size="icon"
            onClick={() => sendMessage(inputValue)}
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
