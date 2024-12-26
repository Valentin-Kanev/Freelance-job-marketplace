import React, { useState } from "react";
import { useLoginUser } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useQueryClient } from "react-query";
import Input from "../UI/Input";
import { jwtDecode } from "jwt-decode";
import Button from "../UI/Button";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const loginMutation = useLoginUser();
  const navigate = useNavigate();
  const { login } = useAuth();
  const queryClient = useQueryClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { email: formData.email, password: formData.password },
      {
        onSuccess: (data: { token: string; userId: string }) => {
          const decodedToken: {
            id: string;
            username: string;
            user_type: string;
          } = jwtDecode(data.token);

          const userType = decodedToken.user_type;

          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", decodedToken.id);
          localStorage.setItem("userType", userType);

          login(data.token);

          queryClient.invalidateQueries("profile", { exact: true });
          queryClient.refetchQueries("profile", { exact: true });

          navigate("/jobs");
        },
        onError: (error) => {
          console.error("Login failed:", error);
        },
      }
    );
  };

  return (
    <form onSubmit={handleLogin} className="space-y-3 h-full ">
      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        placeholder="Enter your email"
      />
      <Input
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
        placeholder="Enter your password"
      />
      <Button
        label="Login"
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-lg "
      />
      {loginMutation.isError && (
        <p className="text-red-500 mt-2">{loginMutation.error?.message}</p>
      )}
    </form>
  );
};

export default Login;
