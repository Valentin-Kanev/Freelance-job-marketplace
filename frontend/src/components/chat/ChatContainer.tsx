import React, { useState, useEffect } from "react";
import ChatRoomList from "./ChatList";
import ChatRoom from "./ChatRoom";

interface ChatContainerProps {
  initialRoomId?: string | null; // Add initialRoomId prop
}

const ChatContainer: React.FC<ChatContainerProps> = ({ initialRoomId }) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(
    initialRoomId || null
  );

  useEffect(() => {
    if (initialRoomId) {
      setSelectedRoomId(initialRoomId);
    }
  }, [initialRoomId]);

  return (
    <div className="flex h-full bg-gray-50 rounded-lg shadow-lg overflow-hidden w-full">
      {/* Chat Room List */}
      <div className="w-1/4 border-r overflow-y-auto">
        <ChatRoomList
          onSelectRoom={setSelectedRoomId}
          selectedRoomId={selectedRoomId}
        />
      </div>

      {/* Chat Room */}
      <div className="w-3/4 flex flex-col">
        {selectedRoomId ? (
          <ChatRoom roomId={selectedRoomId} />
        ) : (
          <p className="m-auto text-gray-500">
            Select a chat room to view messages.
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;
