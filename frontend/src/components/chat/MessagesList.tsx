import React, { useEffect, useRef } from "react";
import { useMessages } from "../../hooks/useChat";
import { useAuth } from "../../contexts/AuthContext";

interface MessagesListProps {
  roomId: string;
}

const MessagesList: React.FC<MessagesListProps> = ({ roomId }) => {
  const { data: messages, isLoading, error } = useMessages(roomId);
  const { userId } = useAuth(); // Get logged-in user ID
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading)
    return <p className="text-center text-gray-500">Loading messages...</p>;
  if (error)
    return <p className="text-center text-red-500">Error fetching messages.</p>;

  return (
    <div className="flex flex-col h-full bg-white shadow-md rounded-md overflow-hidden">
      <div className="flex-grow p-4 overflow-y-auto">
        {messages?.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet.</p>
        ) : (
          <ul className="space-y-2">
            {messages?.map((message: any, index: number) => {
              const isLoggedUser = message.sender_id === userId;

              return (
                <li
                  key={index}
                  className={`max-w-[75%] p-3 rounded-lg text-sm flex flex-col ${
                    isLoggedUser
                      ? "bg-blue-500 text-white self-end ml-auto"
                      : "bg-gray-200 text-gray-900 self-start mr-auto"
                  }`}
                >
                  {!isLoggedUser && (
                    <p className="font-bold mb-1">{message.sender_username}</p>
                  )}
                  <p>{message.content}</p>
                  <p
                    className={`text-xs mt-1 self-end ${
                      isLoggedUser
                        ? "text-white/70" // Semi-transparent white for blue background
                        : "text-gray-500"
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default MessagesList;
