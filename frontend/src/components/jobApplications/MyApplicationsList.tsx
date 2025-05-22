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

  if (isLoading) return <StatusMessage message="Loading applications..." />;
  if (isError) return <StatusMessage message={`Error: ${error?.message}`} />;
  if (!applications || applications.length === 0) {
    return <StatusMessage message="No applications found" />;
  }

  return (
    <ul className="space-y-2">
      {applications
        .slice()
        .sort(
          (a, b) =>
            new Date(b.applicationDate).getTime() -
            new Date(a.applicationDate).getTime()
        )
        .map((application, index) => (
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
  );
};

export default MyApplications;
