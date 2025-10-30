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
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const lastNode = lastMessageRef.current;

    if (!container) return;

    const scrollTo = (top: number) => {
      if (typeof container.scrollTo === "function") {
        container.scrollTo({
          top,
          behavior: "smooth",
        });
      } else {
        container.scrollTop = top;
      }
    };

    if (lastNode && container.contains(lastNode)) {
      const containerRect = container.getBoundingClientRect();
      const lastRect = lastNode.getBoundingClientRect();
      const marginBottom =
        typeof window !== "undefined"
          ? parseFloat(window.getComputedStyle(lastNode).marginBottom || "0")
          : 0;
      const offsetFromBottom =
        lastRect.bottom - containerRect.bottom + marginBottom;
      const maxScrollTop = container.scrollHeight - container.clientHeight;
      const targetScrollTop = Math.min(
        Math.max(container.scrollTop + offsetFromBottom, 0),
        Math.max(maxScrollTop, 0),
      );
      scrollTo(targetScrollTop);
      return;
    }

    scrollTo(container.scrollHeight);
  }, [messages]);

  return (
    <div className="relative flex h-full w-full justify-center tk-readable">
      <div className="fixed inset-x-4 pr-auto bottom-[calc(var(--footer-height,0)+1rem)] top-[calc(var(--header-height,0)+1rem)] mx-auto grid w-full max-w-5xl grid-rows-[1fr_auto] rounded-3xl border border-border bg-background shadow-lg">
        <div
          ref={scrollContainerRef}
          aria-live="polite"
          aria-relevant="additions text"
          className="overflow-y-auto px-4 py-6 sm:px-6"
        >
          <div className="flex min-h-full flex-col justify-end gap-4">
            {messages.map((msg, index) => {
              const isLast = index === messages.length - 1;
              return (
                <div
                  key={msg.id}
                  ref={isLast ? lastMessageRef : undefined}
                >
                  <DssChatBox message={msg.message} type={msg.type} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-border px-4 py-4 sm:px-6">
          {errorMsg && (
            <div className="mb-3 rounded-md bg-red-50 p-3 text-center text-sm text-destructive-foreground">
              {errorMsg}
            </div>
          )}

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
