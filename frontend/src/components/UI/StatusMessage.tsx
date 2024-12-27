import React from "react";

interface StatusMessageProps {
  message: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ message }) => {
  return <div className="text-gray-500">{message}</div>;
};

export default StatusMessage;
