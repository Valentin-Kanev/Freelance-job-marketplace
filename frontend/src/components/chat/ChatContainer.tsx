import React, { useState } from "react";
import ChatRoomList from "./ChatList";
import ChatRoom from "./ChatRoom";

const ChatContainer: React.FC = () => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  return (
    <div className="flex h-full bg-gray-50 rounded-lg shadow-lg overflow-hidden w-full">
      {/* Chat Room List */}
      <div className="w-1/4 border-r overflow-y-auto">
        <ChatRoomList onSelectRoom={setSelectedRoomId} />
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
