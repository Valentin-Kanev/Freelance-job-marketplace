import { createContext, useState, useContext } from "react";

interface ChatContextProps {
  isChatOpen: boolean;
  chatRoom_id: string | null;
  openChat: (roomId: string) => void;
  closeChat: () => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatRoom_id, setChatRoomId] = useState<string | null>(null);

  const openChat = (roomId: string) => {
    setChatRoomId(roomId);
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setChatRoomId(null);
  };

  return (
    <ChatContext.Provider
      value={{ isChatOpen, chatRoom_id, openChat, closeChat }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
