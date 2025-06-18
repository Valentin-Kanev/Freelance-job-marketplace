import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import JobList from "./JobList";
import JobDetails from "./JobDetails";
import StatusMessage from "../UI/StatusMessage";
import { Job } from "../../types/JobTypes";
import { useFetchJob } from "../../hooks/useJobs";
import { useQueryClient } from "react-query";
import { useAuth } from "../../contexts/AuthContext";

interface Props {
  jobs: Job[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

const JobListWithDetails: React.FC<Props> = ({
  jobs,
  isLoading,
  isError,
  error,
}) => {
  const navigate = useNavigate();
  const { job_id } = useParams<{ job_id: string }>();
  const parsedJobId = job_id ? Number(job_id) : null;
  const queryClient = useQueryClient();
  const { userId, userType } = useAuth();

  const {
    isLoading: isJobLoading,
    isError: isJobError,
    error: jobError,
    refetch,
  } = useFetchJob(parsedJobId ?? -1);

  const handleSelectJob = (job: Job) => {
    navigate(`/jobs/${job.job_id}`);
  };

  const handleJobUpdate = () => {
    refetch();
    queryClient.invalidateQueries(["jobs"]);
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
            <JobList
              jobs={jobs}
              selectedjob_id={parsedJobId}
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
              job_id={parsedJobId ?? -1}
              userId={userId || ""}
              userType={userType || ""}
              onJobUpdate={handleJobUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListWithDetails;
