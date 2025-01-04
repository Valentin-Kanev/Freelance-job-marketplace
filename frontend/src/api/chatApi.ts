interface Message {
  sender_id: string;
  content: string;
  timestamp: string;
  sender_username: string; // Make this field required
}

const API_BASE_URL = "http://localhost:3000"; // Replace with your backend URL

// Fetch all chat rooms for the user
export const fetchChatRooms = async (): Promise<any[]> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    console.error("No auth token found in localStorage");
    throw new Error("No auth token found");
  }
  console.log("Fetching chat rooms with token:", token);

  const response = await fetch(`${API_BASE_URL}/chat-rooms`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch chat rooms:", response.statusText);
    throw new Error("Failed to fetch chat rooms");
  }

  return response.json();
};

// Fetch messages for a specific chat room
export const fetchMessages = async ({
  chatRoomId,
  page,
}: {
  chatRoomId: string;
  page?: number;
}): Promise<Message[]> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    console.error("No auth token found in localStorage");
    throw new Error("No auth token found");
  }
  console.log(
    "Fetching messages for chat room:",
    chatRoomId,
    "with token:",
    token
  );

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
    console.error("Failed to fetch messages:", response.statusText);
    throw new Error("Failed to fetch messages");
  }

  return response.json();
};

// Send a message in a chat room
export const sendMessage = async ({
  roomId,
  sender_id,
  content,
}: {
  roomId: string;
  sender_id: string;
  content: string;
}): Promise<any> => {
  const token = localStorage.getItem("authToken"); // Use consistent key
  if (!token) {
    console.error("No auth token found in localStorage");
    throw new Error("No auth token found");
  }
  console.log("Sending message to chat room:", roomId, "with token:", token);

  const response = await fetch(
    `${API_BASE_URL}/chat-rooms/${roomId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Ensure the token is provided
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sender_id, content }),
    }
  );

  if (!response.ok) {
    console.error("Failed to send message:", response.statusText);
    throw new Error("Failed to send message");
  }

  return response.json();
};

// Create or get a chat room
export const createChatRoom = async ({
  user_1_id,
  user_2_id,
}: {
  user_1_id: string;
  user_2_id: string;
}): Promise<any> => {
  const token = localStorage.getItem("authToken"); // Use consistent key
  if (!token) {
    console.error("No auth token found in localStorage");
    throw new Error("No auth token found");
  }
  console.log("Creating chat room with token:", token);

  const response = await fetch(`${API_BASE_URL}/chat-rooms`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // Ensure the token is provided
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_1_id, user_2_id }),
  });

  if (!response.ok) {
    console.error("Failed to create or fetch chat room:", response.statusText);
    throw new Error("Failed to create or fetch chat room");
  }

  return response.json();
};
