import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { DssChecklistLink } from "components/dss";
import { DssExternalVsInternal } from "components/dss/DssExternalVsInternal";
import { useAppState } from "contexts/AppStateContext";
import { Button } from "js/components/ui/button";
import { InputGroup, InputGroupTextarea } from "js/components/ui/input-group";
import { useChat } from "js/hooks/useChat";
import { useInternalStatus } from "js/hooks/useInternalStatus";

import Chat from "./Chat";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const { isInternal, updateInternalStatus } = useInternalStatus();

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("hasSeenDssModal");
    if (!hasSeenModal) {
      setShowModal(true);
    }
  }, []);

  const handleCloseModal = () => {
    localStorage.setItem("hasSeenDssModal", "true");
    setShowModal(false);
  };

  useEffect(() => {
    if (isInternal === true) {
      console.log("User works in Trondheim kommune");
    } else if (isInternal === false) {
      console.log("User does NOT work in Trondheim kommune");
    }
  }, [isInternal]);

  const { currentChatId, createNewChat, getChecklistContext } = useAppState();
  const {
    messages,
    errorMsg,
    inputValue,
    setInputValue,
    isSending,
    isReady,
    sendMessage,
  } = useChat("/api/chat/chat/");

  const hasMessages = messages.length > 0;
  const hasHandledChecklistContext = useRef(false);

  useEffect(() => {
    if (!currentChatId) {
      createNewChat();
    }
  }, [currentChatId, createNewChat]);

  useEffect(() => {
    const handleChecklistContext = async () => {
      if (hasHandledChecklistContext.current) return;
      if (!currentChatId || !isReady) return;

      const shouldSendMessage = localStorage.getItem(
        "shouldSendChecklistMessage",
      );
      if (!shouldSendMessage) return;

      // Set flag immediately to prevent double triggers
      hasHandledChecklistContext.current = true;
      localStorage.removeItem("shouldSendChecklistMessage");

      try {
        // Fetch context once and pass it to the first send
        const ctx = await getChecklistContext(currentChatId);
        await sendMessage(
          "Kan du hjelpe meg med personvernvurdering basert på denne informasjonen?",
          ctx || undefined,
        );
      } catch (error) {
        console.error("Failed to send checklist message with context:", error);
        // eslint-disable-next-line require-atomic-updates
        hasHandledChecklistContext.current = false; // allow retry
      }
    };

    handleChecklistContext();
  }, [currentChatId, isReady, sendMessage]);

  useEffect(() => {
    hasHandledChecklistContext.current = false;
  }, [currentChatId]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || isSending) return;
    sendMessage(inputValue);
  };

  if (hasMessages) {
    return (
      <Chat
        errorMsg={errorMsg}
        inputValue={inputValue}
        isSending={isSending}
        messages={messages}
        setInputValue={setInputValue}
        onSend={handleSendMessage}
      />
    );
  }

  return (
    <div className="flex min-h-full w-full flex-col tk-readable p-6 pt-[var(--header-height)]">
      <DssChecklistLink />
      {showModal && (
        <DssExternalVsInternal
          autoOpen
          onClose={handleCloseModal}
          onSelect={(value) => {
            updateInternalStatus(value);
            handleCloseModal();
          }}
        />
      )}
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
        <h1 className="text-4xl font-semibold">ASQ</h1>
        <p className="text-lg">
          Få veiledning om hvordan du følger personvernsprinsippene, GDPR, DPIA
          eller hva enn du måtte lure på av personvernrelaterte spørsmål eller
          søknader.
        </p>
        <div className="flex flex-row justify-center gap-4">
          <p className="mt-4 bg-card px-4 py-2 rounded-md text-md">
            Usikker på hvor du skal begynne?{" "}
            <a
              aria-label="Lær det grunnleggende om personvern"
              className="underline"
              href="/personvern"
            >
              Lær om personvern
            </a>
          </p>
          <p className="mt-4 bg-card px-4 py-2 rounded-md text-md">
            Vil du heller gjøre en full personvernvurdering?{" "}
            <a aria-label="Start personvernsjekkliste" href="/sjekkliste">
              Start her
            </a>
          </p>
        </div>
      </section>

      {errorMsg && (
        <div
          aria-live="polite"
          className="mx-auto w-full max-w-2xl rounded-md bg-red-50 p-4 text-center text-destructive-foreground"
          role="alert"
        >
          {errorMsg}
        </div>
      )}

      <div className="mx-auto w-full max-w-3xl mt-6">
        <InputGroup className="rounded-4xl p-2 gap-2 shadow-sm transition-all focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-blue/30">
          <InputGroupTextarea
            autoFocus
            className="min-h-8 flex-1 rounded-4xl border-1 bg-transparent outline-transparent focus:outline-none"
            id="user-input"
            placeholder="Spør om GDPR, DPIA eller personvernspørsmål..."
            rows={
              inputValue.length < 144 ? (inputValue.length < 72 ? 2 : 4) : 6
            }
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            aria-label="Send melding"
            className="rounded-4xl"
            disabled={!inputValue.trim() || isSending}
            size="icon"
            onClick={handleSendMessage}
          >
            <Send aria-hidden="true" className="size-4" />
          </Button>
        </InputGroup>
      </div>
      <div className="flex flex-col mt-4 text-center text-sm text-muted-foreground mx-auto mb-4 space-y-2 max-w-md tk-readable">
        <p className="text-sm">
          Ikke skriv inn sensitive eller identifiserbare personopplysninger.
          Personvernsassistenten kan gi juridisk veiledning, men erstatter ikke
          profesjonell juridisk rådgivning.
        </p>
      </div>
    </div>
  );
};

export default Home;
