// CustomButton.tsx
import React from "react";

// CustomButton.tsx
interface CustomButtonProps {
  label: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset"; // Add this line
}

const Button: React.FC<CustomButtonProps> = ({
  label,
  className,
  onClick,
  disabled,
  type = "button", // Default to "button" if not provided
}) => {
  return (
    <button
      type={type}
      className={`bg-blue-600 text-white py-2 px-6 text-sm rounded-full hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
