import React from "react";
import { useNavigate } from "react-router-dom";

interface JobListProps {
  jobs: any[];
  isLoading: boolean;
  isError: boolean;
  error: any;
}

const JobList: React.FC<JobListProps> = ({
  jobs,
  isLoading,
  isError,
  error,
}) => {
  const navigate = useNavigate();

  const handleViewJobDetail = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  if (isLoading) {
    return <p className="text-gray-500">Loading jobs...</p>;
  }

  if (isError) {
    return <p className="text-red-500">Error loading jobs: {error?.message}</p>;
  }

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {jobs?.map((job) => (
        <div
          key={job.id}
          className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          <h3 className="text-xl font-semibold text-primary">{job.title}</h3>
          <p className="text-gray-600">Budget: ${job.budget}</p>
          <p className="text-gray-600">
            Offered by: {job.client_username || "Unknown"}
          </p>
          <button
            onClick={() => handleViewJobDetail(job.id)}
            className="mt-4 text-accent hover:underline transition duration-300"
          >
            View Details
          </button>
        </div>
      ))}
    </div>
  );
};

export default JobList;
