import { UserRound } from "lucide-react";
import { FC } from "react";
import ReactMarkdown from "react-markdown";

import trondheimKommuneAvatar from "../../../assets/images/tk-avatar.svg";

interface ChatBoxProps {
  type: "user" | "bot";
  message: string;
}

export const DssChatBox: FC<ChatBoxProps> = ({ type, message }) => {
  return (
    <div
      className={`flex flex-1 overflow-y-scroll align-bottom gap-3 px-3 ${type === "user" ? "justify-end" : "justify-start"}`}
    >
      {type === "user" ? (
        <>
          <div className="max-w-2xl p-4 rounded-lg bg-brand-blue text-accent-foreground ml-12 whitespace-pre-wrap">
            {message}
          </div>
          <div
            aria-label="bruker avatar"
            className="w-16 h-16 bg-card rounded-full flex items-center justify-center flex-shrink-0"
            role="img"
          >
            <UserRound aria-hidden="true" className="w-7 h-7" />
          </div>
        </>
      ) : (
        <>
          <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center flex-shrink-0 p-3">
            <img
              alt="Trondheim Kommune avatar"
              className="w-full h-full object-contain"
              src={trondheimKommuneAvatar}
            />
          </div>
          <div className="max-w-2xl p-4 rounded-lg bg-muted mr-12 whitespace-pre-wrap">
            <ReactMarkdown
              components={{
                a: ({ href, children }) => (
                  <a
                    className="text-brand-blue underline hover:text-brand-cyan transition-colors"
                    href={href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {message}
            </ReactMarkdown>
          </div>
        </>
      )}
    </div>
  );
};
