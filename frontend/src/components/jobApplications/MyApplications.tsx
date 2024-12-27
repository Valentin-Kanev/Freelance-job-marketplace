import React from "react";
import { useMyApplications } from "../../hooks/useApplication";
import StatusMessage from "../UI/StatusMessage";

const MyApplications: React.FC = () => {
  const { data: applications, isLoading, isError, error } = useMyApplications();

  if (isLoading) return <StatusMessage message="Loading applications..." />;
  if (isError) return <StatusMessage message={`Error: ${error?.message}`} />;
  if (!applications || applications.length === 0) {
    return <StatusMessage message="No applications found" />;
  }

  return (
    <ul className="space-y-2">
      {applications.map((application, index) => (
        <li
          key={`${application.jobId}-${index}`}
          className="p-4 border rounded-lg"
        >
          <h3 className="text-lg font-semibold">
            Applied for: {application.jobTitle}
          </h3>
          <p className="text-md text-gray-600">{application.coverLetter}</p>
          <p className="text-sm text-gray-600">
            Applied on:{" "}
            {new Date(application.applicationDate).toLocaleDateString()}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default MyApplications;
