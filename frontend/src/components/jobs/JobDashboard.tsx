import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JobList from "./JobList";
import JobDetails from "./JobDetails";
import { useNavigate } from "react-router-dom";
import StatusMessage from "../UI/StatusMessage";

const JobDashboard: React.FC<{
  jobs: any[];
  isLoading: boolean;
  isError: boolean;
  error: any;
}> = ({ jobs, isLoading, isError, error }) => {
  const navigate = useNavigate();
  const { id: jobId } = useParams<{ id: string }>();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [jobUpdated, setJobUpdated] = useState(false);
  const userId = localStorage.getItem("userId") || "";
  const userType = localStorage.getItem("userType") || "";

  useEffect(() => {
    const job = jobs.find((j) => j.id === jobId);
    setSelectedJob(job || null);
  }, [jobId, jobs, jobUpdated]);

  const handleSelectJob = (job: any) => {
    setSelectedJob(job);
    navigate(`/jobs/${job.id}`);
  };

  const handleJobUpdate = () => {
    setJobUpdated((prev) => !prev);
  };

  if (isLoading) return <StatusMessage message="Loading jobs..." />;
  if (isError) return <StatusMessage message={`Error: ${error?.message}`} />;

  return (
    <div className="pt-12 flex justify-center min-h-screen bg-gray-50">
      <div className="flex w-[1100px] h-full bg-white shadow-lg rounded-lg">
        <div className="w-[300px] max-h-screen overflow-y-auto p-4">
          <JobList
            jobs={jobs}
            selectedJobId={selectedJob?.id || null}
            onSelectJob={handleSelectJob}
          />
        </div>

        <div className="flex-1 p-6 h-full">
          <JobDetails
            job={selectedJob}
            userId={userId}
            userType={userType}
            onJobUpdate={handleJobUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default JobDashboard;
