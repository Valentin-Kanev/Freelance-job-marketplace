import { useMutation } from "react-query";
import { User } from "../../types/AuthenticationTypes";
import { registerUser } from "../../api/userAuthenticationApi";

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
