import { Send } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

import { DssChatBox } from "components/dss";
import { Button } from "js/components/ui/button";
import { InputGroup, InputGroupTextarea } from "js/components/ui/input-group";
import { ChatMessage } from "types/ChatMessage";

type ChatProps = {
  messages: ChatMessage[];
  errorMsg: string | null;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  isSending: boolean;
  onSend: () => void;
};

const Chat = ({
  messages,
  errorMsg,
  inputValue,
  setInputValue,
  isSending,
  onSend,
}: ChatProps) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = scrollContainerRef.current;

    if (!node) return;

    if (typeof node.scrollTo === "function") {
      node.scrollTo({
        top: node.scrollHeight,
        behavior: "smooth",
      });
    } else {
      node.scrollTop = node.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col min-h-full mb-34 max-h-screen justify-end align-bottom w-full bg-red-400 tk-readable overflow-hidden scroll-none">
      <div className="flex-1 min-h-0 overflow-clip bg-yellow-400">
        <div
          ref={scrollContainerRef}
          className="flex h-full mb-80 max-h-[calc(100vh-var(40rem)-var(30rem))] flex-col justify-end overflow-x-scroll p-6 bg-purple-400"
        >
          <div className="space-y-4 overflow-clip">
            {messages.map((msg) => (
              <DssChatBox key={msg.id} message={msg.message} type={msg.type} />
            ))}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mx-auto w-full max-w-2xl rounded-md bg-red-50 p-4 text-center text-destructive-foreground">
          {errorMsg}
        </div>
      )}

      <div className="fixed bottom-10 justify-end w-full tk-readable min-h-fit border-t border-brand-gray bg-background bg-yellow-400 p-4 overflow-x-scroll">
        <div className="sticky bottom-0 bg-green-400 mx-auto flex w-full max-w-3xl items-end gap-2">
          <InputGroup className="rounded-4xl p-2 shadow-sm transition-all focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-blue/30">
            <InputGroupTextarea
              autoFocus
              className="min-h-8 flex-1 rounded-4xl border-none bg-transparent outline-transparent focus:outline-none"
              id="user-input"
              placeholder="Spør om GDPR, DPIA eller personvernspørsmål..."
              rows={inputValue.length < 144 ? (inputValue.length < 72 ? 2 : 4) : 6}
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  onSend();
                }
              }}
            />
            <Button
              aria-label="Send melding"
              className="rounded-4xl"
              disabled={!inputValue.trim() || isSending}
              size="icon"
              onClick={onSend}
            >
              <Send className="size-4" />
            </Button>
          </InputGroup>
        </div>
      </div>
    </div>
  );
};

export default Chat;
