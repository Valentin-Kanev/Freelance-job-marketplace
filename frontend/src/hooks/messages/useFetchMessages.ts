import { useQuery } from "react-query";
import { fetchMessages } from "../../api/chatApi";
import { ChatMessage } from "../../components/chat/MessageTypes";

export const useFetchMessages = (roomId: string, page = 1) => {
  return useQuery<ChatMessage[], Error>(["messages", roomId, page], () =>
    fetchMessages({ roomId })
  );
};
