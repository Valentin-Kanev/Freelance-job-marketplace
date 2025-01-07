interface Message {
  sender_id: string;
  content: string;
  timestamp: string;
  sender_username: string;
}

const API_BASE_URL = "http://localhost:3000";

export const fetchChatRooms = async (): Promise<any[]> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No auth token found");
  }

  const response = await fetch(`${API_BASE_URL}/chat-rooms`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch chat rooms");
  }

  return response.json();
};

export const fetchMessages = async ({
  chatRoomId,
  page,
}: {
  chatRoomId: string;
  page?: number;
}): Promise<Message[]> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No auth token found");
  }

  const response = await fetch(
    `${API_BASE_URL}/chat-rooms/${chatRoomId}/messages?page=${page}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  return response.json();
};

export const sendMessage = async ({
  roomId,
  sender_id,
  content,
}: {
  roomId: string;
  sender_id: string;
  content: string;
}): Promise<any> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No auth token found");
  }

  const response = await fetch(
    `${API_BASE_URL}/chat-rooms/${roomId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sender_id, content }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
};

export const createChatRoom = async ({
  user_1_id,
  user_2_id,
}: {
  user_1_id: string;
  user_2_id: string;
}): Promise<any> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No auth token found");
  }

  const response = await fetch(`${API_BASE_URL}/chat-rooms`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_1_id, user_2_id }),
  });

  if (!response.ok) {
    throw new Error("Failed to create or fetch chat room");
  }

  return response.json();
};
