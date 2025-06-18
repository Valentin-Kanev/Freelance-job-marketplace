import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useQueryClient } from "react-query";
import { useAuthUser } from "../hooks/useAuth";

interface AuthContextType {
  isLoggedIn: boolean;
  userId: string | null;
  userType: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const { data: authUser, isLoading } = useAuthUser();

  const login = (token: string) => {
    localStorage.setItem("authToken", token);
    setIsAuthChecked(false);
    queryClient.invalidateQueries(["authUser"]);
  };

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    setUserId(null);
    setUserType(null);
    setIsLoggedIn(false);
    queryClient.invalidateQueries("userProfile");
    queryClient.invalidateQueries(["authUser"]);
  }, [queryClient]);

  useEffect(() => {
    if (isLoading) return;
    if (authUser) {
      setUserId(authUser.id);
      setUserType(authUser.userType);
      setIsLoggedIn(true);
    } else {
      setUserId(null);
      setUserType(null);
      setIsLoggedIn(false);
    }
    setIsAuthChecked(true);
  }, [authUser, isLoading]);

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
