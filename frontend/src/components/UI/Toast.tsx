// components/Toast.tsx
import React, { useState, useEffect } from "react";

interface ToastProps {
  message: string;
  duration?: number; // in milliseconds
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 bg-green-500 text-white py-3 px-6 rounded-md shadow-md">
      {message}
    </div>
  );
};

export default Toast;
