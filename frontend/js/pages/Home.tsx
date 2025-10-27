import { Send } from "lucide-react";
import { useEffect } from "react";

import { DssFourButtons, DssChatBox } from "components/dss";
import { Button } from "js/components/ui/button";
import { InputGroup, InputGroupTextarea } from "js/components/ui/input-group";
import { useChat } from "js/hooks/useChat";
import { ChatMessage } from "types/ChatMessage";

const Home = () => {
  const {
    messages,
    errorMsg,
    inputValue,
    setInputValue,
    isSending,
    sendMessage,
  } = useChat("/api/chat/chat/");

  useEffect(() => {
    const shouldSend = localStorage.getItem("shouldSendChecklistContext");

    if (shouldSend === "true") {
      localStorage.removeItem("shouldSendChecklistContext");
      sendMessage(
        "Kan du hjelpe meg med personvernvurdering basert på denne informasjonen?",
      );
    }
  }, [sendMessage]);

  return (
    <div className="h-full w-full flex flex-col">
      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-lg mx-auto">
            <DssFourButtons submitPromptFunction={sendMessage} />
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg: ChatMessage) => (
            <DssChatBox key={msg.id} message={msg.message} type={msg.type} />
          ))}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 text-destructive-foreground text-center">
          {errorMsg}
        </div>
      )}
      <div className="border-t border-brand-gray bg-background p-4">
        <div className="mx-auto flex gap-2">
          <InputGroup
            className="rounded-4xl p-2 shadow-sm
            focus-within:border-brand-primary
            focus-within:ring-2
            focus-within:ring-brand-blue/30
            transition-all
          "
          >
            <InputGroupTextarea
              autoFocus
              className="flex-1 min-h-8 rounded-4xl bg-transparent border-none outline-transparent focus:outline-none"
              id="user-input"
              placeholder="Spør om GDPR, DPIA eller personvernspørsmål..."
              rows={
                inputValue.length < 144 ? (inputValue.length < 72 ? 2 : 4) : 6
              }
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault(); // Prevent newline
                  if (inputValue.trim() && !isSending) {
                    sendMessage(inputValue);
                  }
                }
              }}
            />
            <Button
              aria-label="Submit"
              className="rounded-4xl"
              disabled={!inputValue.trim() || isSending}
              size="icon"
              onClick={() => sendMessage(inputValue)}
            >
              <Send className="size-4" />
            </Button>
          </InputGroup>
        </div>
      </div>
    </div>
  );
};

export default Home;
