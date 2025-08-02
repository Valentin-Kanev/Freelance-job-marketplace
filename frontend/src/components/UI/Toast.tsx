import { useState, useEffect } from "react";

type ToastProps = {
  message: string;
  duration?: number;
  onClose?: () => void;
};

const Toast: React.FC<ToastProps> = ({ message, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 bg-blue-600 text-white py-3 px-6 rounded-md shadow-md">
      {message}
    </div>
  );
};

export default Toast;
