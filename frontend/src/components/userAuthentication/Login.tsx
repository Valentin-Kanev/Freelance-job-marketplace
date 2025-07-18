import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  LoginValidation,
} from "../../validationSchemas/userManagmentValidationScheema";
import { useLoginUser } from "../../hooks/authentication/useLoginUser";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useQueryClient } from "react-query";
import Input from "../UI/Input";
import Button from "../UI/Button";

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginValidation>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useLoginUser();
  const navigate = useNavigate();
  const { login } = useAuth();
  const queryClient = useQueryClient();

  const onSubmit = (data: LoginValidation) => {
    loginMutation.mutate(data, {
      onSuccess: (response: { token: string; userId: string }) => {
        login(response.token);

        queryClient.invalidateQueries("profile", { exact: true });
        queryClient.refetchQueries("profile", { exact: true });

        navigate("/jobs");
      },
      onError: (error: Error) => {
        setError("root", { message: error.message });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 h-full">
      <Input
        label="Email"
        type="email"
        {...register("email")}
        placeholder="Enter your email"
      />
      {errors.email && (
        <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
      )}

      <Input
        label="Password"
        type="password"
        {...register("password")}
        placeholder="Enter your password"
      />
      {errors.password && (
        <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
      )}

      <Button
        label="Login"
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-lg"
      />

      {(errors.root?.message || loginMutation.isError) && (
        <p className="text-red-500 mt-2">
          {errors.root?.message || loginMutation.error?.message}
        </p>
      )}
    </form>
  );
};

export default Login;
