import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserSchema,
  CreateUserValidation,
} from "../../validationSchemas/userManagmentValidationScheema";
import { useRegisterUser } from "../../hooks/authentication/useRegisterUser";
import Input from "../UI/Input";

type RegisterProps = {
  onRegistrationSuccess: () => void;
};

const Register: React.FC<RegisterProps> = ({ onRegistrationSuccess }) => {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
    reset,
  } = useForm<CreateUserValidation>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      userType: undefined,
    },
  });

  const userType = watch("userType");
  const registerMutation = useRegisterUser();

  const onSubmit = (data: CreateUserValidation) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        reset();
        onRegistrationSuccess();
      },
      onError: (error: Error) => {
        setError("root", { message: error.message });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <Input
        label="Username"
        {...register("username")}
        placeholder="Enter your username"
      />
      {errors.username && (
        <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>
      )}

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

      <div>
        <label className="block text-gray-600 font-medium mb-2">
          User Type
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center p-2 rounded">
            <input
              type="radio"
              value="freelancer"
              {...register("userType")}
              checked={userType === "freelancer"}
              className="form-radio text-blue-500 hover:ring hover:ring-blue-500"
            />
            <span className="ml-2">Freelancer</span>
          </label>
          <label className="flex items-center p-2 rounded">
            <input
              type="radio"
              value="client"
              {...register("userType")}
              checked={userType === "client"}
              className="form-radio text-blue-500 hover:ring hover:ring-blue-500"
            />
            <span className="ml-2">Client</span>
          </label>
        </div>
        {errors.userType && (
          <p className="text-sm text-red-600 mt-1">{errors.userType.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Register
      </button>
      {(errors.root?.message || registerMutation.isError) && (
        <p className="text-red-500 mt-2">
          {errors.root?.message || registerMutation.error?.message}
        </p>
      )}
    </form>
  );
};

export default Register;
