import React from "react";

interface JobDetailsInfoProps {
  title: string;
  description: string;
  budget: number;
  deadline: string;
  clientUsername: string;
}

const JobDetailsInfo: React.FC<JobDetailsInfoProps> = ({
  description,
  budget,
  deadline,
  clientUsername,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-xl font-medium text-gray-700">Description</h4>
        <p className="text-gray-600 text-lg">{description}</p>
      </div>
      <div>
        <h4 className="text-xl font-medium text-gray-700">Budget</h4>
        <p className="text-gray-600 text-lg">${budget}</p>
      </div>
      <div>
        <h4 className="text-xl font-medium text-gray-700">Deadline</h4>
        <p className="text-gray-600 text-lg">
          {new Date(deadline).toLocaleDateString()}
        </p>
      </div>
      <div>
        <h4 className="text-xl font-medium text-gray-700">Posted By</h4>
        <p className="text-gray-600 text-lg">{clientUsername}</p>
      </div>
    </div>
  );
};

export default JobDetailsInfo;
