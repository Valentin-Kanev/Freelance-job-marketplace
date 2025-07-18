import { useMutation, useQueryClient } from "react-query";
import { createChatRoom } from "../../api/chatApi";

export const useCreateChatRoom = () => {
  const queryClient = useQueryClient();
  return useMutation(createChatRoom, {
    onSuccess: () => {
      queryClient.invalidateQueries("chatRooms");
    },
  });
};
