import { useState } from "react";
import ChatRoomsList from "./ChatRoomsList";
import MessagesList from "./MessagesList";
import ChatForm from "./ChatForm";

interface ChatContainerProps {
  initialRoomId?: string | null;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ initialRoomId }) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(
    initialRoomId || null
  );

  return (
    <div className="flex h-full bg-gray-50 rounded-lg shadow-lg overflow-hidden w-full">
      <div className="w-1/4 border-r overflow-y-auto">
        <ChatRoomsList
          onSelectRoom={setSelectedRoomId}
          selectedRoomId={selectedRoomId}
        />
      </div>

      <div className="w-3/4 flex flex-col">
        {selectedRoomId ? (
          <div className="flex-grow p-6 bg-white shadow-lg rounded-lg h-full flex flex-col">
            <div className="flex-grow overflow-y-auto mb-4">
              <MessagesList roomId={selectedRoomId} />
            </div>
            <div className="mt-auto">
              <ChatForm roomId={selectedRoomId} />
            </div>
          </div>
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
