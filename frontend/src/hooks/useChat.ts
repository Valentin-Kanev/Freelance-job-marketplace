import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  fetchChatRooms,
  createChatRoom,
  fetchMessages,
  sendMessage,
} from "../api/chatApi";

export const useChatRooms = () => {
  return useQuery("chatRooms", fetchChatRooms);
};

export const useCreateChatRoom = () => {
  const queryClient = useQueryClient();
  return useMutation(createChatRoom, {
    onSuccess: () => {
      queryClient.invalidateQueries("chatRooms");
    },
  });
};

export const useMessages = (roomId: string, page = 1) => {
  return useQuery(["messages", roomId, page], () =>
    fetchMessages({ chatRoomId: roomId, page })
  );
};

export const useSendMessage = (roomId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: { senderId: string; content: string }) =>
      sendMessage({ roomId, ...data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["messages", roomId]);
      },
    }
  );
};
