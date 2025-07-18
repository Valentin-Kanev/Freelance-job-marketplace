import { jwtDecode } from "jwt-decode";

export type DecodedToken = {
  id: string;
  userType: string;
  exp: number;
};

export const isTokenValid = (token: string): boolean => {
  try {
    const decodedToken: DecodedToken = jwtDecode(token);
    return decodedToken.exp * 1000 > Date.now();
  } catch (e) {
    return false;
  }
};
