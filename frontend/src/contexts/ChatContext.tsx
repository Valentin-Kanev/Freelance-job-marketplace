import { createContext, useState, useContext } from "react";

type ChatContextProps = {
  isChatOpen: boolean;
  chatRoomId: string | null;
  openChat: (roomId: string) => void;
  closeChat: () => void;
};

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

type ChatProviderProps = {
  children: React.ReactNode;
};

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);

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
      value={{ isChatOpen, chatRoomId, openChat, closeChat }}
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
