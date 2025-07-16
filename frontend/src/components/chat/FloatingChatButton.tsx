import ChatContainer from "./ChatContainer";
import { useAuth } from "../../contexts/AuthContext";

interface FloatingChatButtonProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  chatRoom_id: string | null;
  isVisible: boolean;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({
  isOpen,
  setIsOpen,
  chatRoom_id,
  isVisible,
}) => {
  const { loggedInUserId } = useAuth();

  if (!loggedInUserId || !isVisible) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white shadow-lg rounded-lg w-[40vw] h-[80vh] flex flex-col">
          <div className="flex justify-between items-center p-2 border-b">
            <h2 className="text-lg font-semibold">Chat</h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-500">
              ✕
            </button>
          </div>
          <ChatContainer initialRoomId={chatRoom_id} />
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Chat
        </button>
      )}
    </div>
  );
};

export default FloatingChatButton;
