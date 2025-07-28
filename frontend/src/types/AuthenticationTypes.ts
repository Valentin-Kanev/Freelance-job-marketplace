export type User = {
  id: number;
  username: string;
  email: string;
  userType: string;
};

export type RegisterUserData = {
  username: string;
  password: string;
  email: string;
  userType: string;
};

export type LoginUserData = {
  email: string;
  password: string;
};
