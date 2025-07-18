import { useQuery } from "react-query";
import { fetchChatRooms } from "../../api/chatApi";

export const useFetchChatRooms = () => {
  return useQuery("chatRooms", fetchChatRooms);
};
