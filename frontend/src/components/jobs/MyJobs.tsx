import { useQuery } from "react-query";
import { fetchJobsByClient } from "../../api/jobApi";
import { Link } from "react-router-dom";

const MyJobs = ({ clientId }: { clientId: string }) => {
  const {
    data: jobs,
    isLoading,
    error,
  } = useQuery(["jobsByClient", clientId], () => fetchJobsByClient(clientId), {
    enabled: !!clientId,
  });

  if (isLoading) return <p>Loading jobs...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Jobs</h1>
      {jobs?.length ? (
        <ul className="list-disc pl-5 space-y-3">
          {jobs.map((job) => (
            <li key={job.id}>
              <Link
                to={`/jobs/${job.id}`}
                className="text-lg font-semibold text-blue-600 transition-transform transform hover:translate-y-[-2px] hover:text-blue-700"
              >
                {job.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">You have not created any jobs yet.</p>
      )}
    </div>
  );
};

export default MyJobs;
