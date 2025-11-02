import { Send } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useMemo, useRef } from "react";

import { DssChatBox, DssChecklistLink } from "components/dss";
import { Button } from "js/components/ui/button";
import { InputGroup, InputGroupTextarea } from "js/components/ui/input-group";
import { useSidebar } from "js/components/ui/sidebar";
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
  let sidebarState: { state: "expanded" | "collapsed"; isMobile: boolean } = {
    state: "expanded",
    isMobile: false,
  };

  try {
    const sidebar = useSidebar();
    sidebarState = {
      state: sidebar.state,
      isMobile: sidebar.isMobile,
    };
  } catch {
    // Tests render without a SidebarProvider; fall back to sensible defaults.
  }

  const sidebarVisibility = sidebarState.state;
  const sidebarIsMobile = sidebarState.isMobile;

  const sidebarOffsets = useMemo(() => {
    const isCollapsed = sidebarVisibility === "collapsed";
    const sidebarWidthVar = isCollapsed
      ? "var(--sidebar-width-icon, 4rem)"
      : "var(--sidebar-width, 16rem)";

    if (sidebarIsMobile) {
      return {
        left: "1rem",
        right: "1rem",
      };
    }

    return {
      left: `calc(${sidebarWidthVar})`,
      right: "0rem",
    };
  }, [sidebarIsMobile, sidebarVisibility]);

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
    <div className="relative h-full min-w-100 sm:text-md md:text-lg lg:text-lg w-full tk-readable">
      <div
        className="fixed z-10 flex max-w-[calc(100vh-var(--sidebar-width, 4rem))]"
        style={{
          top: "calc(var(--header-height, 0px))",
          bottom: "calc(var(--footer-height, 0px))",
          left: sidebarOffsets.left,
          right: sidebarOffsets.right,
        }}
      >
        <div className="flex h-full w-full justify-center">
          <div className="flex h-full w-full min-w-md flex-col">
            <DssChecklistLink />

            <div
              ref={scrollContainerRef}
              aria-live="polite"
              aria-relevant="additions text"
              className="flex-1 overflow-y-auto justify-center px-4 py-6 sm:px-6"
            >
              <div className="flex mx-auto min-h-full max-w-6xl flex-col justify-end gap-4">
                {messages.map((msg, index) => {
                  const isLast = index === messages.length - 1;
                  return (
                    <div key={msg.id} ref={isLast ? lastMessageRef : undefined}>
                      <DssChatBox message={msg.message} type={msg.type} />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border px-4 py-4 sm:px-6">
              {errorMsg && (
                <div
                  aria-live="polite"
                  className="mb-3 rounded-md bg-red-50 p-3 text-center text-sm text-destructive-foreground"
                  role="alert"
                >
                  {errorMsg}
                </div>
              )}

              <InputGroup className="rounded-4xl p-2 shadow-sm transition-all focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-blue/30">
                <InputGroupTextarea
                  autoFocus
                  className="min-h-8 flex-1 rounded-4xl border-none bg-transparent outline-transparent focus:outline-none"
                  id="user-input"
                  placeholder="Spør om GDPR, DPIA eller personvernspørsmål..."
                  rows={
                    inputValue.length < 144
                      ? inputValue.length < 72
                        ? 2
                        : 4
                      : 6
                  }
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
                  <Send aria-hidden="true" className="size-4" />
                </Button>
              </InputGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
