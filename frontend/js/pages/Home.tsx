import { Send } from "lucide-react";
import { useEffect } from "react";

import { DssChatBox } from "components/dss";
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
    <div className="flex flex-col h-full w-full gap-20 mx-auto tk-readable">
      {messages.length === 0 && (
        <section className="flex-1 flex flex-col gap-1.5 items-center text-center">
          <h1 className="text-4xl font-semibold mb-4 text-center">ASQ</h1>
          <p className="text-lg text-center">
            Still spørsmål på vanlig norsk. Få veiledning om GDPR, DPIA
            (personvernkonsekvensvurdering), anonymisering og juridiske
            vurderinger.
          </p>
          <a href="/personvern">Lær det grunnleggende om personvern (5 min)</a>
        </section>
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
      <div className="flex flex-col text-center text-sm text-muted-foreground mx-auto mb-4 space-y-2 max-w-md tk-readable">
        <p className="text-sm">
          Ikke skriv inn sensitive eller identifiserbare personopplysninger.
          Personvernsassistenten kan gi juridisk veiledning, men erstatter ikke
          profesjonell juridisk rådgivning.
        </p>
        <p className="text-sm">
          Vil du heller gjøre en full personvernvurdering?{" "}
          <a href="/sjekkliste">Start her</a>
        </p>
      </div>
    </div>
  );
};

export default Home;
