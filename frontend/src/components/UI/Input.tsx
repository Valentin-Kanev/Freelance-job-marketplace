import React, { useState } from "react";

interface InputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  onFocus?: () => void;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  value,
  onChange,
  required = false,
  type = "text",
  placeholder,
  error,
  onFocus,
}) => {
  const [isTouched, setIsTouched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTouched(true);
    onChange(e);
  };

  const handleFocus = () => {
    setIsTouched(true);
    if (onFocus) onFocus();
  };

  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        required={required}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
          ${error && isTouched ? "border-red-500" : "border-gray-300"}`}
        placeholder={placeholder}
      />
      {error && isTouched && (
        <p className="mt-1 text-sm text-red-500 transition-all duration-200 ease-in-out">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
