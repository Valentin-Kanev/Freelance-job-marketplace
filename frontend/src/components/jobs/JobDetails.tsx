import React, { useState } from "react";
import Button from "../UI/Button";
import JobApplicationsList from "../jobApplications/JobApplicationsList";
import EditJob from "./JobActions/EditJob";
import DeleteJob from "./JobActions/DeleteJob";
import { Link } from "react-router-dom";
import { formatBudget } from "../../utils/formatBudget";
import { useFetchJob } from "../../hooks/jobs/useFetchJob";
import { HiOutlineClipboardList } from "react-icons/hi";
import ApplyForJob from "../jobApplications/ApplyForJob";

type JobDetailsProps = {
  jobId: number;
  userId: string;
  userType: string;
  isInModal?: boolean;
  currentModal?: string | null;
  onjobEdit?: () => void;
  onJobDelete?: () => void;
};

const JobDetails: React.FC<JobDetailsProps> = ({
  jobId,
  userId,
  userType,
  isInModal = false,
  currentModal = null,
  onjobEdit,
  onJobDelete,
}) => {
  const { data: job, isError } = useFetchJob(jobId);
  const [activeModal, setActiveModal] = useState<
    "edit" | "delete" | "apply" | null
  >(null);

  return (
    <>
      {isError ? (
        <div className="text-center mt-10 text-red-500">
          Failed to load job details.
        </div>
      ) : !job ? (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full text-gray-400">
          <HiOutlineClipboardList className="text-7xl mb-6" />
          <h3 className="text-2xl font-semibold mb-2">No job selected</h3>
          <p className="text-md">
            Please select a job from the list to view its details.
          </p>
        </div>
      ) : (
        <div className="w-full overflow-y-auto p-4 scroll-smooth max-h-[80vh]">
          <h2 className="text-4xl font-bold mb-4 break-all overflow-hidden">
            {job.title}
          </h2>
          <p className="text-lg font-semibold mb-2">
            <span className="text-black">Offered by:</span>{" "}
            <Link
              to={`/profiles/${job.clientId}`}
              className="text-blue-600 hover:text-blue-800"
            >
              {job.clientUsername}
            </Link>
          </p>
          <p className="text-lg font-semibold text-green-600 mb-4">
            💵 Budget: {formatBudget(job.budget)}
          </p>
          <p className="text-md text-gray-600 mb-4">
            📅 Deadline: {new Date(job.deadline).toLocaleDateString()}
          </p>
          <div className="flex justify-left gap-4 mb-4">
            {!isInModal &&
              currentModal === null &&
              userType === "client" &&
              userId === job.clientId && (
                <>
                  <Button
                    label="Edit"
                    onClick={() => setActiveModal("edit")}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  />
                  <Button
                    label="Delete"
                    onClick={() => setActiveModal("delete")}
                    className="bg-red-600 text-white hover:bg-red-700"
                  />
                </>
              )}
            {!isInModal &&
              currentModal === null &&
              userType === "freelancer" && (
                <Button
                  label="Apply"
                  onClick={() => setActiveModal("apply")}
                  className="bg-green-600 text-white hover:bg-green-700"
                />
              )}
          </div>
          <p className="text-xl text-gray-800 font-semibold">About the Job:</p>
          <p className="text-md text-gray-600 mb-4 border-b border-gray-300 pb-2 break-all overflow-hidden">
            {job.description}
          </p>

          {userId === job.clientId && !isInModal && (
            <JobApplicationsList jobId={job.jobId} creatorId={job.clientId} />
          )}

          {activeModal === "edit" && (
            <EditJob
              job={job}
              onClose={() => setActiveModal(null)}
              onSuccess={onjobEdit}
            />
          )}
          {activeModal === "delete" && (
            <DeleteJob
              jobId={job.jobId}
              isOpen={activeModal === "delete"}
              onSuccess={onJobDelete}
              onClose={() => setActiveModal(null)}
            />
          )}
          {activeModal === "apply" && (
            <ApplyForJob
              jobId={job.jobId}
              onClose={() => setActiveModal(null)}
            />
          )}
        </div>
      )}
    </>
  );
};

export default JobDetails;
