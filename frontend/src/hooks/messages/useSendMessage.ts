import { useMutation, useQueryClient } from "react-query";
import { sendMessage } from "../../api/chatApi";

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
