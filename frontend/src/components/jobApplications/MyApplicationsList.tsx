import { useEffect } from "react";
import { useFetchMyApplications } from "../../hooks/useApplication";
import StatusMessage from "../UI/StatusMessage";
import ExpandableText from "../UI/ExpandableText";

const MyApplications: React.FC = () => {
  const {
    data: applications,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchMyApplications();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      {isLoading ? (
        <StatusMessage message="Loading applications..." />
      ) : isError ? (
        <StatusMessage message={`Error: ${error?.message}`} />
      ) : !applications || applications.length === 0 ? (
        <StatusMessage message="No applications found" />
      ) : (
        <ul className="space-y-2">
          {applications.map((application, index) => (
            <li
              key={`${application.job_id}-${index}`}
              className="p-4 border rounded-lg"
            >
              <h3 className="text-lg font-semibold">
                Applied for: {application.jobTitle}
              </h3>
              <div>
                <ExpandableText text={application.coverLetter} />
              </div>
              <p className="text-sm text-gray-600">
                Applied on:{" "}
                {new Date(application.applicationDate).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default MyApplications;
