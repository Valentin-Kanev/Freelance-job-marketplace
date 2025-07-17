import {
  User,
  RegisterUserData,
  LoginUserData,
} from "../types/AuthenticationTypes";
import { fetchClient } from "./utils/fetchClientApi";

export const registerUser = async (data: RegisterUserData): Promise<User> => {
  return fetchClient<User>("/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const loginUser = async (
  data: LoginUserData
): Promise<{ token: string; userId: string; userType: string }> => {
  return fetchClient<{ token: string; userId: string; userType: string }>(
    "/login",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
};

export const fetchUserProfile = async (): Promise<User> => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No token found. Please log in.");
  }

  return fetchClient<User>("/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
