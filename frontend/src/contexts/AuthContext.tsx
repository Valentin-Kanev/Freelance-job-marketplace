import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import { useQueryClient } from "react-query";

interface AuthContextType {
  isLoggedIn: boolean;
  userId: string | null;
  userType: string | null; // Add userType here
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null); // Add state for userType
  const [isAuthChecked, setIsAuthChecked] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const isTokenExpired = (token: string): boolean => {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return Date.now() >= exp * 1000; // Convert exp to milliseconds
  };

  const login = (token: string) => {
    if (isTokenExpired(token)) {
      logout();
      return;
    }

    localStorage.setItem("token", token);
    const decodedToken = jwtDecode<{ id: string; user_type: string }>(token); // Add user_type
    const newUserId = decodedToken.id;
    const newUserType = decodedToken.user_type; // Extract user_type

    localStorage.setItem("userId", newUserId);
    localStorage.setItem("userType", newUserType); // Store userType in localStorage

    setUserId(newUserId);
    setUserType(newUserType); // Update state
    setIsLoggedIn(true);

    queryClient.invalidateQueries(["profile", newUserId]);
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType"); // Remove userType from localStorage

    setUserId(null);
    setUserType(null); // Clear userType state
    setIsLoggedIn(false);

    queryClient.invalidateQueries("userProfile");
  }, [queryClient]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && !isTokenExpired(token)) {
      const decodedToken = jwtDecode<{ id: string; user_type: string }>(token); // Decode user_type
      setUserId(decodedToken.id);
      setUserType(decodedToken.user_type); // Set userType
      setIsLoggedIn(true);
    } else {
      logout();
    }

    setIsAuthChecked(true);
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userId, userType, login, logout }}
    >
      {isAuthChecked && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
