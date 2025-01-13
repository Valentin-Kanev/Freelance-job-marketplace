import { useState } from "react";
import { useRegisterUser } from "../../hooks/useAuth";
import Input from "../UI/Input";

interface RegisterProps {
  onRegistrationSuccess: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    userType: "client",
  });

  const registerMutation = useRegisterUser();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(
      {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        user_type: formData.userType,
      },
      {
        onSuccess: () => {
          setFormData({
            username: "",
            email: "",
            password: "",
            userType: "client",
          });
          onRegistrationSuccess();
        },
      }
    );
  };

  return (
    <form onSubmit={handleRegister} className="space-y-3 ">
      <Input
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        required
        placeholder="Enter your username"
      />
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
      <div>
        <label className="block text-gray-600 font-medium mb-2">
          User Type
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center p-2 rounded">
            <input
              type="radio"
              name="userType"
              value="freelancer"
              checked={formData.userType === "freelancer"}
              onChange={handleChange}
              required
              className="form-radio text-blue-500 hover:ring hover:ring-blue-500"
            />
            <span className="ml-2">Freelancer</span>
          </label>
          <label className="flex items-center p-2 rounded">
            <input
              type="radio"
              name="userType"
              value="client"
              checked={formData.userType === "client"}
              onChange={handleChange}
              required
              className="form-radio text-blue-500 hover:ring hover:ring-blue-500"
            />
            <span className="ml-2">Client</span>
          </label>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Register
      </button>
      {registerMutation.isError && (
        <p className="text-red-500 mt-2">{registerMutation.error?.message}</p>
      )}
    </form>
  );
};

export default Register;
