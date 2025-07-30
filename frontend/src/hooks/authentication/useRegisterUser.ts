import { useMutation } from "react-query";
import { User } from "../../components/userAuthentication/AuthenticationTypes";
import { registerUser } from "../../api/userAuthenticationApi";

export const useRegisterUser = () => {
  return useMutation<User, Error, Parameters<typeof registerUser>[0]>(
    registerUser
  );
};
