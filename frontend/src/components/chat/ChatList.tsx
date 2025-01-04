import React, { useState } from "react";
import { useChatRooms } from "../../hooks/useChat";

interface ChatRoomListProps {
  onSelectRoom: (roomId: string) => void;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({ onSelectRoom }) => {
  const { data: chatRooms, isLoading } = useChatRooms();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const handleSelectRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    onSelectRoom(roomId);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg h-full overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4">Chats</h2>
      {isLoading ? (
        <div className="text-gray-500">Loading chat rooms...</div>
      ) : (
        <ul className="space-y-2">
          {chatRooms?.map((room: any) => {
            const otherUser = room.otherUser;
            const isSelected = room.id === selectedRoomId;
            return (
              <li
                key={room.id}
                className={`p-2 rounded-full cursor-pointer ${
                  isSelected ? "bg-gray-300" : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => handleSelectRoom(room.id)}
              >
                {otherUser?.username || "Unknown User"}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ChatRoomList;
