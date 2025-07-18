import React, { createContext, useContext, ReactNode } from "react";
import { useQueryClient } from "react-query";
import { useAuthenticatedUser } from "../hooks/authentication/useAuthenticatedUser";

interface AuthContextType {
  isLoggedIn: boolean;
  loggedInUserId: string | null;
  userType: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const { data: authUser, isLoading } = useAuthenticatedUser();

  const isLoggedIn = !!authUser;
  const loggedInUserId = authUser?.id || null;
  const userType = authUser?.userType || null;

  const login = (token: string) => {
    localStorage.setItem("authToken", token);
    queryClient.invalidateQueries(["authUser"]);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    queryClient.invalidateQueries("userProfile");
    queryClient.invalidateQueries(["authUser"]);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, loggedInUserId, userType, login, logout }}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <span className="text-lg text-gray-700 animate-pulse">
            Loading...
          </span>
        </div>
      ) : (
        children
      )}
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
