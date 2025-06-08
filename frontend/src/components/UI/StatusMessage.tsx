interface StatusMessageProps {
  message: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ message }) => {
  return (
    <div className="flex justify-center">
      <div className="inline-flex items-left gap-2 bg-white px-6 py-4 my-6 text-gray-800 text-base font-medium">
        <span>{message}</span>
      </div>
    </div>
  );
};

export default StatusMessage;
