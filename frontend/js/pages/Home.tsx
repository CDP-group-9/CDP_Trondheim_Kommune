import { useState } from "react";

import { FourButtons } from "../components/ui/app-four-buttons";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";

const Home = () => {
  const [text, setText] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(";").shift();
    return "";
  }

  async function handleChatSubmit(input: string) {
    try {
      const response = await fetch(
        "http://localhost:8000/api/test-response/fetch_by_keyword/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFTOKEN": getCookie("csrftoken") || "",
          },
          credentials: "include",
          body: JSON.stringify({ input }),
        },
      );
      const data: { response?: string; error?: string } = await response.json();
      if (response.ok && data.response !== undefined) {
        setText(data.response);
      } else {
        setErrorMsg(data.error || "Unknown error");
      }
    } catch (error) {
      setErrorMsg("No connection to server.");
    }
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex flex-col h-full items-center justify-center">
        <div className="mb-6 max-w-lg mx-auto">
          <FourButtons submitPromptFunction={handleChatSubmit} />
        </div>
        {text && (
          <div className="p-4 border rounded bg-gray-50">
            <p className="whitespace-pre-wrap">{text}</p>
          </div>
        )}
        {errorMsg && <div className="text-red-600 p-2">{errorMsg}</div>}
        <div className="grid gap-2 max-w-lg w-full mx-auto">
          <Textarea
            id="user-input"
            placeholder="Skriv noe her..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button
            className="cursor-pointer"
            disabled={!inputValue.trim()}
            onClick={() => handleChatSubmit(inputValue)}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
