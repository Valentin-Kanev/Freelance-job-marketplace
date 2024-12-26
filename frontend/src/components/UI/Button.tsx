interface CustomButtonProps {
  label: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  children?: React.ReactNode;
}

const Button: React.FC<CustomButtonProps> = ({
  label,
  className = "",
  onClick,
  disabled = false,
  type = "button",
}) => {
  const baseClass =
    "bg-blue-600 text-white py-2 px-6 text-sm rounded-full hover:bg-blue-700 transition duration-300 ease-in-out transform  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50";
  return (
    <button
      type={type}
      className={`${baseClass} ${className}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
