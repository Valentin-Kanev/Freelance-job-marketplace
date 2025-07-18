import { useQuery } from "react-query";
import { fetchMessages } from "../../api/chatApi";

export const useMessages = (roomId: string, page = 1) => {
  return useQuery(["messages", roomId, page], () => fetchMessages({ roomId }));
};
