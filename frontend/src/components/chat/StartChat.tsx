import { useCreateChatRoom } from "../../hooks/useChat";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../UI/Button";

interface StartChatProps {
  targetUserId: string;
  onStartChat: (roomId: string) => void;
}

const StartChat: React.FC<StartChatProps> = ({ targetUserId, onStartChat }) => {
  const { loggedInUserId } = useAuth();
  const createChatRoom = useCreateChatRoom();

  const handleStartChat = () => {
    if (!loggedInUserId) {
      alert("User ID is not available. Please log in.");
      return;
    }
    createChatRoom.mutate(
      {
        user_1_id: loggedInUserId,
        user_2_id: targetUserId,
      },
      {
        onSuccess: (chatRoom) => {
          onStartChat(chatRoom.chatRoom_id);
        },
        onError: () => {
          alert("Failed to create chat room. Please try again.");
        },
      }
    );
  };

  return (
    <Button
      label="Start Chat"
      onClick={handleStartChat}
      className="bg-green-600 text-white py-2 px-6 rounded-full hover:bg-green-700 transition duration-300 ease-in-out shadow-md"
    />
  );
};

export default StartChat;
