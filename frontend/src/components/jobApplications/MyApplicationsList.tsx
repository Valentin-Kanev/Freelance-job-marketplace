import { useFetchMyApplications } from "../../hooks/application/useFetchMyApplications";
import StatusMessage from "../UI/StatusMessage";
import ExpandableText from "../UI/ExpandableText";
import { Link } from "react-router-dom";

const MyApplications: React.FC = () => {
  const {
    data: applications,
    isLoading,
    isError,
    error,
  } = useFetchMyApplications();

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
              key={`${application.jobId}-${index}`}
              className="p-4 border rounded-lg"
            >
              <Link
                to={`/jobs/${application.jobId}`}
                className="text-lg font-semibold text-blue-600 "
              >
                {application.jobTitle}
              </Link>
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
