export interface User {
  id: number;
  username: string;
  email: string;
  userType: string;
}

export interface RegisterUserData {
  username: string;
  password: string;
  email: string;
  userType: string;
}

export interface LoginUserData {
  email: string;
  password: string;
}
