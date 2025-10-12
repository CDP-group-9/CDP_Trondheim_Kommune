import { useState } from "react";

import { FourButtons } from "../components/ui/app-four-buttons";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";

const Home = () => {
  const [text, setText] = useState<string | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(";").shift();
    return "";
  }

  async function handleChatSubmit(input: string) {
    try {
      const response = await fetch(
        "http://localhost:8000/api/counter/increment/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFTOKEN": getCookie("csrftoken") || "",
          },
          credentials: "include",
        },
      );
      const data: { count?: number; error?: string } = await response.json();
      if (response.ok && data.count !== undefined) {
        setText(input);
        setCount(data.count);
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
        <div className="grid gap-2 max-w-lg w-full mx-auto">
          <Textarea id="user-input" placeholder="Skriv noe her..." />
          {text && count && (
            <div className="p-4 border rounded bg-gray-50">
              <p className="whitespace-pre-wrap">
                {text}
                {count}
              </p>
            </div>
          )}
          {errorMsg && <div className="text-red-600 p-2">{errorMsg}</div>}
          <Button
            className="cursor-pointer"
            onClick={() =>
              handleChatSubmit(
                (document.getElementById("user-input") as HTMLTextAreaElement)
                  .value,
              )
            }
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
