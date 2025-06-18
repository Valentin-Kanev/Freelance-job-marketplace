import { useQuery } from "react-query";
import { fetchJobsByClient } from "../../api/jobApi";
import { Link } from "react-router-dom";
import StatusMessage from "../UI/StatusMessage";

const MyJobs = ({ clientId }: { clientId: string }) => {
  const {
    data: jobs,
    isLoading,
    error,
  } = useQuery(["jobsByClient", clientId], () => fetchJobsByClient(clientId), {
    enabled: !!clientId,
  });

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
            <li key={job.job_id}>
              <Link
                to={`/jobs/${job.job_id}`}
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
