import userAvatar from "../../../assets/images/user-avatar.svg";
import tkAvatar from "../../../assets/images/tk-avatar.png";

interface ChatBoxProps {
  type: "user" | "bot";
  message: string;
}

const ChatBox = ({ type, message }: ChatBoxProps) => {
  return (
    <div
      className={`flex gap-3 px-3 ${type === "user" ? "justify-end" : "justify-start"}`}
    >
      {type === "user" ? (
        <>
          <div className="max-w-2xl p-4 rounded-lg bg-[#002d52] text-white ml-12">
            {message}
          </div>
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
            <img
              src={userAvatar}
              alt="user avatar"
              className="w-8"
            />
          </div>
        </>
      ) : (
        <>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0 p-3">
            <img
              src={tkAvatar}
              alt="tk avatar"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="max-w-2xl p-4 rounded-lg bg-muted mr-12">
            {message}
          </div>
        </>
      )}
    </div>
  );
};

export { ChatBox };
