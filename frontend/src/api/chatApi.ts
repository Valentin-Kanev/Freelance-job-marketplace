import { ChatRoom } from "../types/chatType";
import { Message } from "../types/MessageTypes";
import { fetchClient } from "./utils/fetchClientApi";

export const fetchChatRooms = async (): Promise<ChatRoom[]> => {
  return fetchClient<ChatRoom[]>("/chat-rooms");
};

export const fetchMessages = async ({
  roomId,
}: {
  roomId: string;
}): Promise<Message[]> => {
  return fetchClient<Message[]>(`/chat-rooms/${roomId}/messages`);
};

export const sendMessage = async ({
  roomId,
  senderId,
  content,
}: {
  roomId: string;
  senderId: string;
  content: string;
}): Promise<Message> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No auth token found");
  }
  return fetchClient<Message>(`/chat-rooms/${roomId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
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
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userOneId, userTwoId }),
  });
};
