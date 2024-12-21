import React from "react";
import { useMyApplications } from "../../hooks/useApplication";

const MyApplications: React.FC = () => {
  const { data: applications, isLoading, isError, error } = useMyApplications();

  if (isLoading) return <div>Loading applications...</div>;

  if (isError) return <div>Error: {error?.message}</div>;

  if (!applications || applications.length === 0) {
    return <div>No applications found</div>;
  }

  return (
    <ul className="space-y-2">
      {applications.map((application, index) => (
        <li
          key={`${application.jobId}-${index}`} // Combine jobId with the index for uniqueness
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
