import { useCreateChatRoom } from "../../hooks/useChat";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../UI/Button";

interface StartChatProps {
  targetUserId: string;
  onStartChat: (roomId: string) => void;
}

const StartChat: React.FC<StartChatProps> = ({ targetUserId, onStartChat }) => {
  const { userId } = useAuth();
  const createChatRoom = useCreateChatRoom();

  const handleStartChat = async () => {
    if (!userId) {
      alert("User ID is not available. Please log in.");
      return;
    }

    try {
      const chatRoom = await createChatRoom.mutateAsync({
        user_1_id: userId,
        user_2_id: targetUserId,
      });
      onStartChat(chatRoom.chat_room_id);
    } catch (error) {
      console.error("Error creating chat room:", error);
      alert("Failed to create chat room. Please try again.");
    }
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
