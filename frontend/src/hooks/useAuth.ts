import { jwtDecode } from "jwt-decode";
import { useMutation, useQuery } from "react-query";
import { registerUser, loginUser } from "../api/userAuthenticationApi";
import { User } from "../types/AuthenticationTypes";
import { DecodedToken } from "../types/DecodedToken";

export const isTokenValid = (token: string): boolean => {
  try {
    const decodedToken: DecodedToken = jwtDecode(token);
    return decodedToken.exp * 1000 > Date.now();
  } catch (e) {
    return false;
  }
};

export const useAuthUser = () => {
  return useQuery<{ id: string; userType: string } | null, Error>(
    "authUser",
    () => {
      const token = localStorage.getItem("authToken");
      if (token && isTokenValid(token)) {
        const decodedToken: DecodedToken = jwtDecode(token);
        return { id: decodedToken.id, userType: decodedToken.user_type };
      } else {
        localStorage.removeItem("authToken");
        return null;
      }
    }
  );
};

export const useRegisterUser = () => {
  return useMutation<User, Error, Parameters<typeof registerUser>[0]>(
    registerUser,
    {
      onError: (error: Error) => {
        console.error("Error registering user:", error.message);
      },
    }
  );
};

export const useLoginUser = () => {
  return useMutation<
    { token: string; userId: string },
    Error,
    Parameters<typeof loginUser>[0]
  >(loginUser, {
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      } else {
        console.error("No token returned from login");
      }
    },
    onError: (error: Error) => {
      console.error("Error logging in:", error.message);
    },
  });
};
