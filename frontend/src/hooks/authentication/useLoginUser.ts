import { useMutation } from "react-query";
import { loginUser } from "../../api/userAuthenticationApi";

export const useLoginUser = () => {
  return useMutation<
    { token: string; userId: string },
    Error,
    Parameters<typeof loginUser>[0]
  >(loginUser, {
    onSuccess: (data: { token: string; userId: string }) => {
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
