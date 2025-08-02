import { ChatRoom } from "../components/chat/ChatTypes";
import { ChatMessage } from "../components/chat/MessageTypes";
import { fetchClient } from "./apiUtils/fetchClientApi";

export const sendMessage = async ({
  roomId,
  senderId,
  content,
}: {
  roomId: string;
  senderId: string;
  content: string;
}): Promise<ChatMessage> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No auth token found");
  }
  return fetchClient<ChatMessage>(`/chat-rooms/${roomId}/messages`, {
    method: "POST",
    body: JSON.stringify({ senderId, content }),
  });
};

export const createChatRoom = async ({
  userOneId,
  userTwoId,
}: {
  userOneId: string;
  userTwoId: string;
}): Promise<ChatRoom> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No auth token found");
  }
  return fetchClient<ChatRoom>("/chat-rooms", {
    method: "POST",
    body: JSON.stringify({ userOneId, userTwoId }),
  });
};

export const fetchChatRooms = async (): Promise<ChatRoom[]> => {
  return fetchClient<ChatRoom[]>("/chat-rooms");
};

export const fetchMessages = async ({
  roomId,
}: {
  roomId: string;
}): Promise<ChatMessage[]> => {
  return fetchClient<ChatMessage[]>(`/chat-rooms/${roomId}/messages`);
};
