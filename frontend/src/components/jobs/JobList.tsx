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
    <div className="w-full max-w-[600px] p-4 overflow-y-auto max-h-[625px]">
      <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-300 pb-2">
        Available Jobs
      </h2>
      {jobs.length === 0 ? (
        <p className="text-gray-600">No jobs available at the moment.</p>
      ) : (
        jobs.map((job, index) => (
          <div
            key={job.id}
            className={`py-2 px-2 group transition-all cursor-pointer ${
              selectedJobId === job.id ? "border-l-4 border-blue-500" : ""
            }`}
            onClick={() => onSelectJob(job)}
          >
            <h3 className="text-lg font-semibold group-hover:underline">
              {job.title}
            </h3>
            <p className="text-sm text-gray-600">
              Offered by: {job.client_username || "Unknown"}
            </p>
            <p className="text-lg font-medium text-green-600">
              💵 Budget: ${job.budget}
            </p>
            <p className="text-sm text-gray-500">
              📅 Deadline: {new Date(job.deadline).toLocaleDateString()}
            </p>
            {index !== jobs.length - 1 && (
              <hr className="my-2 border-gray-300" />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default JobList;
