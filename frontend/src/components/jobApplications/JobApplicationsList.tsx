import { useFetchJobApplications } from "../../hooks/useApplication";
import JobApplicationItem from "./JobApplicationItem";
import StatusMessage from "../UI/StatusMessage";
import { useAuth } from "../../contexts/AuthContext";

interface JobApplicationsListProps {
  job_id: number;
  creatorId: string;
}

const JobApplicationsList: React.FC<JobApplicationsListProps> = ({
  job_id,
  creatorId,
}) => {
  const { userId } = useAuth();

  const {
    data: applications,
    isLoading,
    error,
  } = useFetchJobApplications(job_id);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800">Job Applications</h2>
      {userId !== creatorId ? (
        <StatusMessage message="Unauthorized to view applications" />
      ) : isLoading ? (
        <StatusMessage message="Loading applications..." />
      ) : error ? (
        <StatusMessage message="Error loading applications" />
      ) : applications?.length ? (
        <ul>
          {applications.map((application) => {
            const compositeKey = `${application.job_id}-${application.application_id}`;
            return (
              <li key={compositeKey} className="py-4 w-full">
                <JobApplicationItem application={application} />
              </li>
            );
          })}
        </ul>
      ) : (
        <StatusMessage message="No applications for this job yet." />
      )}
    </div>
  );
};

export default JobApplicationsList;
