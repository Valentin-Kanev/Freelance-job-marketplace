import { useQuery } from "react-query";
import { fetchJobApplications } from "../../api/ApplicationApi";
import JobApplicationItem from "./JobApplicationItem";

interface JobApplicationsListProps {
  jobId: string;
  creatorId: string; // ID of the job creator
}

const JobApplicationsList: React.FC<JobApplicationsListProps> = ({
  jobId,
  creatorId,
}) => {
  const userId = localStorage.getItem("userId");

  const {
    data: applications,
    isLoading,
    error,
  } = useQuery(["jobApplications", jobId], () => fetchJobApplications(jobId), {
    enabled: userId === creatorId,
  });

  if (isLoading)
    return <p className="text-gray-500">Loading applications...</p>;
  if (error) return <p className="text-red-500">Error loading applications</p>;
  if (userId !== creatorId)
    return <p className="text-gray-500">Unauthorized to view applications</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800">Job Applications</h2>
      {applications?.length ? (
        <ul className="">
          {applications.map((application) => (
            <li key={application.id} className="border-b border-gray-300 pb-2">
              <JobApplicationItem application={application} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No applications for this job yet.</p>
      )}
    </div>
  );
};

export default JobApplicationsList;
