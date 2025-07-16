import { Link } from "react-router-dom";
import StatusMessage from "../UI/StatusMessage";
import { useFetchMyJobs } from "../../hooks/useJobs";

const MyJobs = ({ clientId }: { clientId: string }) => {
  const { data: jobs, isLoading, error } = useFetchMyJobs(clientId);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Jobs</h1>
      {isLoading ? (
        <StatusMessage message="Loading jobs..." />
      ) : error instanceof Error ? (
        <StatusMessage message={`Error: ${error.message}`} />
      ) : jobs?.length ? (
        <ul className="list-disc pl-5 space-y-3">
          {jobs.map((job) => (
            <li key={job.jobId}>
              <Link
                to={`/jobs/${job.jobId}`}
                className="text-lg font-semibold text-blue-600 transition-transform transform hover:translate-y-[-2px] hover:text-blue-700"
              >
                {job.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <StatusMessage message="You have not created any jobs yet." />
      )}
    </div>
  );
};

export default MyJobs;
