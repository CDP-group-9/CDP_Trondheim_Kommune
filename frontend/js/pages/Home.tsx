import { useState } from "react";
import { FourButtons } from "../components/ui/app-four-buttons";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || "";
  return "";
}

const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]); // Historikk for backend
  const [chatLog, setChatLog] = useState<string[]>([]); // Enkelt logg for visning
  const [fullContext, setFullContext] = useState<string>("");

    const sendMessage = async () => {
      if (!userInput) return;

      try {
        const csrftoken = getCookie("csrftoken") || "";

        // Logg POST-body for debugging
        const postBody = {
          prompt: userInput,
          history: chatHistory,
        };
        console.log("Posting to backend:", JSON.stringify(postBody, null, 2));

        const response = await fetch("/api/chat/chat/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken
          },
          body: JSON.stringify(postBody),
        });

        const data = await response.json();

        if (data.error) {
          alert(data.error);
          return;
        }

        // Oppdater historikk for backend
        setChatHistory(data.history);

        // Oppdater chat-log for visning
        setChatLog((prev) => [...prev, `Du: ${userInput}`, `Chatbot: ${data.response}`]);

        if (data.full_context) {
          setFullContext(data.full_context);
        }

        setUserInput(""); // Tøm tekstfelt
      } catch (err) {
        console.error(err);
        alert("Noe gikk galt med chatten.");
      }
    };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex flex-col h-full items-center justify-center">
        <div className="mb-6 max-w-lg mx-auto">
          <FourButtons />
        </div>
        <div className="grid gap-2 max-w-lg w-full mx-auto">
          <Textarea
            placeholder="Skriv noe her..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
        <div className="mt-6 max-w-lg w-full mx-auto">
          {chatLog.map((msg, i) => (
            <p key={i}>{msg}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;