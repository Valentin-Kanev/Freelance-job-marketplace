// src/hooks/useAuth.ts
import { useMutation } from "react-query";
import { registerUser, loginUser, User } from "../api/userManagmentApi";

// Register Hook
export const useRegisterUser = () => {
  return useMutation<User, Error, Parameters<typeof registerUser>[0]>(
    registerUser,
    {
      onSuccess: (data) => {
        console.log("User registered successfully:", data);
      },
      onError: (error: Error) => {
        console.error("Error registering user:", error.message);
      },
    }
  );
};

// Login Hook
export const useLoginUser = () => {
  return useMutation<{ token: string }, Error, Parameters<typeof loginUser>[0]>(
    loginUser,
    {
      onSuccess: (data) => {
        localStorage.setItem("token", data.token);
        console.log("Login successful:", data.token);
      },
      onError: (error: Error) => {
        console.error("Error logging in:", error.message);
      },
    }
  );
};
