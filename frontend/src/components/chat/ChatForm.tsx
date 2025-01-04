import React, { useState, useEffect } from "react";
import { useSendMessage } from "../../hooks/useChat";
import { useAuth } from "../../contexts/AuthContext";

interface ChatFormProps {
  roomId: string;
}

const ChatForm: React.FC<ChatFormProps> = ({ roomId }) => {
  const [message, setMessage] = useState("");
  const sendMessage = useSendMessage(roomId);
  const { userId } = useAuth();

  const handleSubmit = async () => {
    if (!message.trim() || !userId) return;

    try {
      await sendMessage.mutateAsync({
        sender_id: userId,
        content: message,
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <div className="flex items-center  p-4 border-t border-gray-200">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-grow p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="button"
        onClick={handleSubmit}
        className="ml-4 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Send
      </button>
    </div>
  );
};

export default ChatForm;
