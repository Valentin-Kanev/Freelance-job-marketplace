import React from "react";
import ChatForm from "./ChatForm";
import MessagesList from "./MessagesList";

interface ChatRoomProps {
  roomId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomId }) => {
  return (
    <div className="flex-grow p-6 bg-white shadow-lg rounded-lg h-full flex flex-col">
      {/* <h2 className="text-2xl font-semibold mb-4">Chat Room</h2> */}

      {/* Messages List */}
      <div className="flex-grow overflow-y-auto mb-4">
        <MessagesList roomId={roomId} />
      </div>

      {/* Chat Form */}
      <div className="mt-auto">
        <ChatForm roomId={roomId} />
      </div>
    </div>
  );
};

export default ChatRoom;
