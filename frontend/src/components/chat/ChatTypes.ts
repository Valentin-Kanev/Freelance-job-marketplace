export type ChatUser = {
  id: string;
  username: string;
};
export type ChatRoom = {
  chatRoomId: string;
  userOneId: string;
  userTwoId: string;
  createdAt: string;
  otherUser: ChatUser;
};
