export interface User {
  id: number;
  username: string;
  email: string;
  user_type: string;
}

export interface RegisterUserData {
  username: string;
  password: string;
  email: string;
  user_type: string;
}

export interface LoginUserData {
  email: string;
  password: string;
}
