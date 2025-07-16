export type User = {
  id: string;
  username: string;
};
export type ChatRoom = {
  chatRoomId: string;
  userOneId: string;
  userTwoId: string;
  createdAt: string;
  otherUser: User;
};
