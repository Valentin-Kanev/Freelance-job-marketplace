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
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Job Applications
      </h2>
      {applications?.length ? (
        <ul className="divide-y divide-gray-200">
          {applications.map((application) => (
            <JobApplicationItem
              key={application.id}
              application={application}
            />
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No applications for this job yet.</p>
      )}
    </div>
  );
};

export default JobApplicationsList;
