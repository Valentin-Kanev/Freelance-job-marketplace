export interface User {
  id: number;
  username: string;
  email: string;
  user_type: string;
}

interface RegisterUserData {
  username: string;
  password: string;
  email: string;
  user_type: string;
}

interface LoginUserData {
  email: string;
  password: string;
}

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

// Helper function for making API requests using fetch
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

// Register user
export const registerUser = async (data: RegisterUserData): Promise<User> => {
  return fetchClient<User>("/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Login user
export const loginUser = async (
  data: LoginUserData
): Promise<{ token: string }> => {
  return fetchClient<{ token: string }>("/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
