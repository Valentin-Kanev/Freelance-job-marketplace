import {
  User,
  RegisterUserData,
  LoginUserData,
} from "../types/AuthenticationTypes";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

const fetchClient = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || "Something went wrong");
  }

  return response.json();
};

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

export const logoutUser = (): void => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userType");
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
