import { useQuery } from "react-query";
import { fetchJobApplications } from "../../api/ApplicationApi";
import JobApplicationItem from "./JobApplicationItem";
import StatusMessage from "../UI/StatusMessage";

interface JobApplicationsListProps {
  jobId: string;
  creatorId: string;
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

  if (isLoading) return <StatusMessage message="Loading applications..." />;
  if (error) return <StatusMessage message="Error loading applications" />;
  if (userId !== creatorId)
    return <StatusMessage message="Unauthorized to view applications" />;

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
        <StatusMessage message="No applications for this job yet." />
      )}
    </div>
  );
};

export default JobApplicationsList;
