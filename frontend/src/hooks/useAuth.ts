import { jwtDecode } from "jwt-decode";
import { useMutation, useQuery } from "react-query";
import { registerUser, loginUser, User } from "../api/userAuthenticationApi";

export const isTokenValid = (token: string): boolean => {
  try {
    const decoded: any = (jwtDecode as any)(token);
    return decoded.exp * 1000 > Date.now();
  } catch (e) {
    return false;
  }
};

export const useAuthUser = () => {
  return useQuery<{ id: string; userType: string } | null, Error>(
    "authUser",
    () => {
      const token = localStorage.getItem("token");
      if (token && isTokenValid(token)) {
        const decoded: any = jwtDecode(token);
        return { id: decoded.id, userType: decoded.user_type };
      } else {
        localStorage.removeItem("token");
        return null;
      }
    }
  );
};

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

export const useLoginUser = () => {
  return useMutation<
    { token: string; userId: string },
    Error,
    Parameters<typeof loginUser>[0]
  >(loginUser, {
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        console.log("Login successful:", data.token, data.userId);
      } else {
        console.error("No token returned from login");
      }
    },
    onError: (error: Error) => {
      console.error("Error logging in:", error.message);
    },
  });
};
