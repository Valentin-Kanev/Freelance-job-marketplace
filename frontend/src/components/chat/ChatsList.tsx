import { useState } from "react";
import { useChatRooms } from "../../hooks/useChat";
import { ChatRoom } from "../../types/chatType";

interface ChatRoomListProps {
  onSelectRoom: (roomId: string) => void;
  selectedRoomId?: string | null;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({
  onSelectRoom,
  selectedRoomId,
}) => {
  const { data: chatRooms, isLoading } = useChatRooms();
  const [localSelectedRoomId, setLocalSelectedRoomId] = useState<string | null>(
    selectedRoomId || null
  );

  const handleSelectRoom = (roomId: string) => {
    setLocalSelectedRoomId(roomId);
    onSelectRoom(roomId);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg h-full overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4">Chats</h2>
      {isLoading ? (
        <div className="text-gray-500">Loading chat rooms...</div>
      ) : (
        <ul className="space-y-2">
          {chatRooms?.map((room: ChatRoom) => {
            const isSelected = room.chatRoomId === localSelectedRoomId;
            return (
              <li
                key={room.chatRoomId}
                className={`p-2 rounded-full cursor-pointer ${
                  isSelected ? "bg-blue-300" : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => handleSelectRoom(room.chatRoomId)}
              >
                {room.otherUser?.username || "Unknown User"}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ChatRoomList;
