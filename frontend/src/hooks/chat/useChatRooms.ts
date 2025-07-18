import { useQuery } from "react-query";
import { fetchChatRooms } from "../../api/chatApi";

export const useChatRooms = () => {
  return useQuery("chatRooms", fetchChatRooms);
};
