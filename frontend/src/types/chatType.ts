export type User = {
  id: string;
  username: string;
};
export type ChatRoom = {
  chatRoom_id: string;
  user_1_id: string;
  user_2_id: string;
  created_at: string;
  otherUser: User;
};
