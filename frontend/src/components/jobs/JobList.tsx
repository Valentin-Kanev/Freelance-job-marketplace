import React from "react";

interface JobListProps {
  jobs: any[];
  selectedJobId: string | null;
  onSelectJob: (job: any) => void;
}

const JobList: React.FC<JobListProps> = ({
  jobs,
  selectedJobId,
  onSelectJob,
}) => {
  return (
    <div className="w-[90%] max-w-[300px] p-4 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Available Jobs</h2>
      {jobs.map((job) => (
        <div
          key={job.id}
          className={`p-4 mb-4 bg-white rounded-lg shadow cursor-pointer hover:bg-blue-100 transition-all ${
            selectedJobId === job.id ? "border-2 border-blue-500" : ""
          }`}
          onClick={() => onSelectJob(job)}
        >
          <h3 className="text-lg font-semibold">{job.title}</h3>
          <p className="text-sm text-gray-600">
            Offered by: {job.client_username || "Unknown"}
          </p>
          <p className="text-lg font-medium text-green-600">
            💵 Budget: ${job.budget}
          </p>
          <p className="text-sm text-gray-500">
            📅 Deadline: {new Date(job.deadline).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default JobList;
