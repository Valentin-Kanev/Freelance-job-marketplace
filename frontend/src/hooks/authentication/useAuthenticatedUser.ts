import { useQuery } from "react-query";
import { DecodedToken, isTokenValid } from "../../utils/isTokenValid";
import { jwtDecode } from "jwt-decode";

export const useAuthenticatedUser = () => {
  return useQuery<{ id: string; userType: string } | null, Error>(
    "authUser",
    () => {
      const token = localStorage.getItem("authToken");
      if (token && isTokenValid(token)) {
        const decodedToken: DecodedToken = jwtDecode(token);
        return { id: decodedToken.id, userType: decodedToken.userType };
      } else {
        localStorage.removeItem("authToken");
        return null;
      }
    }
  );
};
