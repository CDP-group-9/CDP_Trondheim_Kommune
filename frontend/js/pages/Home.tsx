import { Send } from "lucide-react";
import { useEffect } from "react";

import { Button } from "js/components/ui/button";
import { InputGroup, InputGroupTextarea } from "js/components/ui/input-group";
import { useChat } from "js/hooks/useChat";

import Chat from "./Chat";

const Home = () => {
  const {
    messages,
    errorMsg,
    inputValue,
    setInputValue,
    isSending,
    sendMessage,
  } = useChat("/api/chat/chat/");
  const hasMessages = messages.length > 0;

  useEffect(() => {
    const shouldSend = localStorage.getItem("shouldSendChecklistContext");

    if (shouldSend === "true") {
      localStorage.removeItem("shouldSendChecklistContext");
      sendMessage(
        "Kan du hjelpe meg med personvernvurdering basert på denne informasjonen?",
      );
    }
  }, [sendMessage]);

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
    <div className="flex min-h-full w-full flex-col justify-evenly tk-readable p-6">
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
        <h1 className="text-4xl font-semibold">ASQ</h1>
        <p className="text-lg">
          Still spørsmål på vanlig norsk. Få veiledning om GDPR, DPIA
          (personvernkonsekvensvurdering), anonymisering og juridiske
          vurderinger.
        </p>
        <a className="underline" href="/personvern">
          Lær det grunnleggende om personvern (5 min)
        </a>
      </section>

      {errorMsg && (
        <div className="mx-auto w-full max-w-2xl rounded-md bg-red-50 p-4 text-center text-destructive-foreground">
          {errorMsg}
        </div>
      )}

      <div className="mx-auto w-full max-w-3xl">
        <InputGroup
          className="rounded-4xl p-2 shadow-sm transition-all focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-blue/30"
        >
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
            <Send className="size-4" />
          </Button>
        </InputGroup>
      </div>

      <div className="mx-auto flex max-w-md flex-col space-y-2 text-center text-sm text-muted-foreground">
        <p>
          Ikke skriv inn sensitive eller identifiserbare personopplysninger.
          Personvernsassistenten kan gi juridisk veiledning, men erstatter ikke
          profesjonell juridisk rådgivning.
        </p>
        <p>
          Vil du heller gjøre en full personvernvurdering?{" "}
          <a className="underline" href="/sjekkliste">
            Start her
          </a>
        </p>
      </div>
    </div>
  );
};

export default Home;
