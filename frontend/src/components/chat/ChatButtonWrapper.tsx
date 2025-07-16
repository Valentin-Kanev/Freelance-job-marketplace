import { useState } from "react";
import { useChat } from "../../contexts/ChatContext";
import FloatingChatButton from "./FloatingChatButton";

export const ChatButtonWrapper: React.FC = () => {
  const { isChatOpen, chatRoom_id, openChat, closeChat } = useChat();
  const [isFloatingChatButtonVisible, setIsFloatingChatButtonVisible] =
    useState(true);

  return (
    <FloatingChatButton
      isOpen={isChatOpen}
      setIsOpen={(isOpen) => {
        if (!isOpen) setIsFloatingChatButtonVisible(true);
        isOpen ? openChat(chatRoom_id!) : closeChat();
      }}
      chatRoom_id={chatRoom_id}
      isVisible={isFloatingChatButtonVisible}
    />
  );
};
