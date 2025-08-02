import { useParams, useNavigate } from "react-router-dom";
import JobsList from "./JobsList";
import JobDetails from "./JobDetails";
import StatusMessage from "../UI/StatusMessage";
import { Job } from "./JobTypes";
import { useFetchJob } from "../../hooks/jobs/useFetchJob";
import { useAuth } from "../../contexts/AuthContext";
import { useFetchJobs } from "../../hooks/jobs/useFetchJobs";

const JobListWithDetails: React.FC = () => {
  const { data: jobs, isLoading, isError, error } = useFetchJobs();
  const { jobId } = useParams<{ jobId: string }>();
  const parsedJobId = jobId ? Number(jobId) : null;
  const { loggedInUserId, userType } = useAuth();
  const navigate = useNavigate();

  const {
    isLoading: isJobLoading,
    isError: isJobError,
    error: jobError,
    refetch,
  } = useFetchJob(parsedJobId ?? -1);

  const handleSelectJob = (job: Job) => {
    navigate(`/jobs/${job.jobId}`);
  };

  return (
    <div className="pt-12 flex justify-center min-h-screen bg-gray-50">
      <div className="flex w-[1100px] h-full bg-white shadow-lg rounded-lg">
        <div className="w-[300px] max-h-screen overflow-y-auto p-4">
          {isLoading && <StatusMessage message="Loading jobs..." />}
          {isError && <StatusMessage message={`Error: ${error?.message}`} />}
          {!isLoading &&
            !isError &&
            (!Array.isArray(jobs) || jobs.length === 0) && (
              <StatusMessage message="No jobs available." />
            )}
          {!isLoading && !isError && Array.isArray(jobs) && jobs.length > 0 && (
            <JobsList
              jobs={jobs}
              selectedJobId={parsedJobId}
              onSelectJob={handleSelectJob}
            />
          )}
        </div>
        <div className="flex-1 p-6 h-full">
          {isJobLoading && <StatusMessage message="Loading job details..." />}
          {isJobError && (
            <StatusMessage message={`Error: ${jobError?.message}`} />
          )}
          {!isJobLoading && !isJobError && (
            <JobDetails
              jobId={parsedJobId ?? -1}
              userId={loggedInUserId || ""}
              userType={userType || ""}
              onjobEdit={() => refetch()}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListWithDetails;
